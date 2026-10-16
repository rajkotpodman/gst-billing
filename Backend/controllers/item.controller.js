import Item from '../models/Item.js';
import asyncHandler from '../utils/asyncHandler.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * List catalog items with search, GST slab filter, and pagination
 */
export const getItems = asyncHandler(async (req, res) => {
  const { search = '', gstPercent, page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const query = { shopId: req.user.shopId };

  if (search && search.trim()) {
    const q = search.trim();
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { hsnCode: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }

  if (gstPercent !== undefined && gstPercent !== '') {
    query.gstPercent = Number(gstPercent);
  }

  const [items, total] = await Promise.all([
    Item.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Item.countDocuments(query),
  ]);

  return apiResponse.success(res, 'Items retrieved successfully', {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
});

/**
 * Get item by ID
 */
export const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!item) {
    return apiResponse.notFound(res, 'Item not found');
  }
  return apiResponse.success(res, 'Item retrieved', { item });
});

/**
 * Create a new catalog item
 */
export const createItem = asyncHandler(async (req, res) => {
  const { name, hsnCode, price, gstPercent, description } = req.body;

  const item = await Item.create({
    shopId: req.user.shopId,
    name: name.trim(),
    hsnCode: hsnCode ? hsnCode.trim() : '',
    price: Number(price),
    gstPercent: Number(gstPercent),
    description: description ? description.trim() : '',
  });

  return apiResponse.created(res, 'Item created successfully', { item });
});

/**
 * Bulk create / import catalog items (e.g. AI-generated top 100 tech products)
 */
export const createBulkItems = asyncHandler(async (req, res) => {
  const { items = [] } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return apiResponse.badRequest(res, 'Please provide an array of items to import');
  }

  const shopId = req.user.shopId;

  // Fetch existing item names to prevent duplicates
  const existing = await Item.find({ shopId }, 'name');
  const existingNames = new Set(existing.map((i) => i.name.toLowerCase().trim()));

  const newItemsToInsert = items
    .filter((item) => item.name && item.name.trim() && !existingNames.has(item.name.toLowerCase().trim()))
    .map((item) => ({
      shopId,
      name: item.name.trim(),
      hsnCode: item.hsnCode ? item.hsnCode.trim() : '8471',
      price: Math.max(0, Number(item.price) || 0),
      gstPercent: item.gstPercent !== undefined ? Number(item.gstPercent) : 18,
      description: item.description ? item.description.trim() : '',
    }));

  let inserted = [];
  if (newItemsToInsert.length > 0) {
    inserted = await Item.insertMany(newItemsToInsert);
  }

  const totalCount = await Item.countDocuments({ shopId });

  return apiResponse.created(res, `Successfully added ${inserted.length} tech products to catalog`, {
    insertedCount: inserted.length,
    skippedCount: items.length - newItemsToInsert.length,
    totalCatalogItems: totalCount,
    items: inserted,
  });
});

/**
 * Bulk import 5,000+ curated commercial tech & mobile products
 */
export const import5000Products = asyncHandler(async (req, res) => {
  const shopId = req.user.shopId;
  const { generate5000Products } = await import('../data/products5000Catalog.js');
  const items = generate5000Products();

  // Fetch existing item names to prevent duplicates
  const existing = await Item.find({ shopId }, 'name');
  const existingNames = new Set(existing.map((i) => i.name.toLowerCase().trim()));

  const newItemsToInsert = items
    .filter((item) => item.name && item.name.trim() && !existingNames.has(item.name.toLowerCase().trim()))
    .map((item) => ({
      shopId,
      name: item.name.trim(),
      hsnCode: item.hsnCode ? item.hsnCode.trim() : '84713010',
      price: Math.max(0, Number(item.price) || 0),
      gstPercent: item.gstPercent !== undefined ? Number(item.gstPercent) : 18,
      description: item.description ? item.description.trim() : '',
    }));

  if (newItemsToInsert.length > 0) {
    const batchSize = 1000;
    for (let i = 0; i < newItemsToInsert.length; i += batchSize) {
      const batch = newItemsToInsert.slice(i, i + batchSize);
      await Item.insertMany(batch, { ordered: false });
    }
  }

  const totalCount = await Item.countDocuments({ shopId });

  return apiResponse.created(res, `Successfully imported ${newItemsToInsert.length} products to catalog`, {
    insertedCount: newItemsToInsert.length,
    skippedCount: items.length - newItemsToInsert.length,
    totalCatalogItems: totalCount,
  });
});

/**
 * Update catalog item
 */
export const updateItem = asyncHandler(async (req, res) => {
  const { name, hsnCode, price, gstPercent, description } = req.body;

  const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!item) {
    return apiResponse.notFound(res, 'Item not found');
  }

  if (name) item.name = name.trim();
  if (hsnCode !== undefined) item.hsnCode = hsnCode.trim();
  if (price !== undefined) item.price = Number(price);
  if (gstPercent !== undefined) item.gstPercent = Number(gstPercent);
  if (description !== undefined) item.description = description.trim();

  await item.save();

  return apiResponse.success(res, 'Item updated successfully', { item });
});

/**
 * Delete catalog item
 */
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, shopId: req.user.shopId });
  if (!item) {
    return apiResponse.notFound(res, 'Item not found');
  }

  await item.deleteOne();

  return apiResponse.success(res, 'Item deleted successfully');
});

export const importAccessories = asyncHandler(async (req, res) => {
  const shopId = req.user.shopId;
  const count = Math.min(1000, Math.max(10, parseInt(req.body.count || req.query.count || 500, 10)));
  const { getTopMobileAccessories } = await import('../data/products5000Catalog.js');
  const items = getTopMobileAccessories(count);

  const existing = await Item.find({ shopId }, 'name');
  const existingNames = new Set(existing.map((i) => i.name.toLowerCase().trim()));

  const newItemsToInsert = items
    .filter((item) => item.name && item.name.trim() && !existingNames.has(item.name.toLowerCase().trim()))
    .map((item) => ({
      shopId,
      name: item.name.trim(),
      hsnCode: item.hsnCode ? item.hsnCode.trim() : '85044030',
      price: Math.max(0, Number(item.price) || 0),
      gstPercent: item.gstPercent !== undefined ? Number(item.gstPercent) : 18,
      description: item.description ? item.description.trim() : '',
    }));

  if (newItemsToInsert.length > 0) {
    await Item.insertMany(newItemsToInsert, { ordered: false });
  }

  const totalCount = await Item.countDocuments({ shopId });

  return apiResponse.created(res, `Successfully imported ${newItemsToInsert.length} top mobile accessories to catalog`, {
    insertedCount: newItemsToInsert.length,
    skippedCount: items.length - newItemsToInsert.length,
    totalCatalogItems: totalCount,
  });
});

export default {
  getItems,
  getItemById,
  createItem,
  createBulkItems,
  import5000Products,
  importAccessories,
  updateItem,
  deleteItem,
};
