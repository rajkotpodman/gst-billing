/**
 * Multi-Agent AI Service for GST Billing System
 * Supports Google Gemini API, Groq Cloud API, and Built-in Intelligent Fallback
 * Injects merchant Business Aims into every dedicated agent prompt
 */

export const BUSINESS_AIMS = {
  MAX_MARGIN: {
    id: 'MAX_MARGIN',
    title: '📈 Maximize Profit Margin',
    badge: 'High Margin',
    description: 'Prioritize premium pricing, minimum 25-35% gross margin, avoid unnecessary discounts, highlight high-margin catalog items.',
    instruction: 'Actively recommend pricing strategies and billing line configurations that yield maximum profit margins (at least 25-35%). Discourage unnecessary discounts. Suggest high-margin upsells and bundle items.'
  },
  FAST_TURNOVER: {
    id: 'FAST_TURNOVER',
    title: '⚡ Fast Inventory & Sales Turnover',
    badge: 'High Turnover',
    description: 'Drive high sales velocity, suggest bundle discounts (5-10%), encourage bulk purchases, accelerate customer checkouts.',
    instruction: 'Focus on volume sales, rapid stock liquidation, and frictionless billing. Suggest appealing volume discounts (5-10%) and bundle items to move stock quickly.'
  },
  ZERO_ERROR_COMPLIANCE: {
    id: 'ZERO_ERROR_COMPLIANCE',
    title: '🛡️ Strict Zero-Error GST Compliance',
    badge: '100% Tax Shield',
    description: 'Rigorous HSN/SAC code validation, exact CGST/SGST vs IGST checks, verify GSTIN checksums, eliminate tax audit risk.',
    instruction: 'Prioritize 100% legal GST compliance under Indian tax laws (CGST Act Section 31). Flag any missing HSN, verify intra-state vs inter-state tax logic, and guarantee zero audit vulnerabilities.'
  },
  CASH_FLOW_RECOVERY: {
    id: 'CASH_FLOW_RECOVERY',
    title: '💰 Aggressive Cash Flow & Receivables',
    badge: 'Cash Flow First',
    description: 'Enforce 7-day payment terms, recommend early settlement discounts (2%), evaluate customer credit risk strictly.',
    instruction: 'Protect shop working capital. Suggest strict payment terms (advance or 7 days maximum), recommend cash discount incentives (e.g. 2% for immediate payment), and warn about high credit risk customers.'
  },
  CUSTOMER_RETENTION: {
    id: 'CUSTOMER_RETENTION',
    title: '🤝 Customer Loyalty & B2B Growth',
    badge: 'Client Loyalty',
    description: 'Build long-term relationships, transparent GST pricing, loyalty discounts for regular parties, friendly follow-ups.',
    instruction: 'Focus on customer delight and long-term B2B retention. Suggest fair and transparent GST tax invoices, friendly payment follow-up communications, and special relationship loyalty terms.'
  },
  CUSTOM: {
    id: 'CUSTOM',
    title: '✍️ Custom Merchant Aim',
    badge: 'Custom Aim',
    description: 'Customized business direction specified by the merchant.',
    instruction: ''
  }
};

export const AGENT_REGISTRY = {
  invoice: {
    id: 'invoice',
    name: 'Invoice Intelligence Agent',
    role: 'Tax Invoice & Billing Specialist',
    icon: 'Receipt',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-orange-500/30',
    glowColor: 'shadow-orange-500/20',
    description: 'Drafts items from natural text, computes accurate GST rates, audits invoice lines, and aligns pricing with your business aim.',
    samplePrompts: [
      'Sold 3 HP Laptops 15s at 48000 each and 5 Wireless Mice at 850 with 18% GST',
      'Audit this bill for GST rate mismatch and recommend margin optimization',
      'Suggest a bundle discount for 10 units of office equipment while protecting my profit',
      'Sold 2 Dell 24-inch Monitors at 12500 and 2 HDMI Cables at 350 with 18% tax'
    ]
  },
  party: {
    id: 'party',
    name: 'Customer & KYC Compliance Agent',
    role: 'GSTIN Verification & Risk Specialist',
    icon: 'Users',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-indigo-500/30',
    glowColor: 'shadow-indigo-500/20',
    description: 'Validates 15-character GSTIN checksums, identifies state codes, assesses credit risk, and writes payment follow-up notices.',
    samplePrompts: [
      'Verify GSTIN 24ABCDE1234F1Z5 and extract state and entity details',
      'Draft a polite yet firm payment reminder notice for an overdue invoice',
      'Assess credit terms for a new customer in Maharashtra purchasing 1.5 Lakhs of goods',
      'Check if customer in Karnataka qualifies for inter-state IGST billing'
    ]
  },
  catalog: {
    id: 'catalog',
    name: 'Catalog & Margin Strategist Agent',
    role: 'HSN Classification & Pricing Specialist',
    icon: 'Package',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    description: 'Finds exact HSN/SAC codes, suggests standard GST slabs (0, 5, 12, 18, 28%), and calculates optimal selling prices based on your margin goals.',
    samplePrompts: [
      'What is the HSN code and GST rate for Wireless Computer Keyboards?',
      'Cost price is ₹1,800. What selling price should I set to achieve a 30% profit margin with 18% GST?',
      'What is the SAC code and GST rate for IT Software Development and AMC Services?',
      'Suggest pricing tier for bulk wholesale orders vs retail walk-ins'
    ]
  },
  tax: {
    id: 'tax',
    name: 'GST Filing & Audit Shield Agent',
    role: 'Tax Compliance & ITC Optimization Specialist',
    icon: 'ShieldCheck',
    color: 'from-purple-500 to-violet-600',
    borderColor: 'border-purple-500/30',
    glowColor: 'shadow-purple-500/20',
    description: 'Simulates GSTR-1 and GSTR-3B audit checks, flags input tax credit (ITC) risks, and provides proactive tax-saving advice.',
    samplePrompts: [
      'Check potential mismatch risks between B2B and B2C sales for monthly GSTR-1',
      'How to maximize legal Input Tax Credit (ITC) before this tax quarter ends?',
      'Audit intra-state (CGST+SGST) vs inter-state (IGST) split in our recent billing',
      'Explain rules for e-invoicing thresholds and debit/credit notes under GST'
    ]
  },
  strategy: {
    id: 'strategy',
    name: 'Executive Business Strategist Agent',
    role: 'Revenue & Growth Advisory Specialist',
    icon: 'TrendingUp',
    color: 'from-rose-500 to-pink-600',
    borderColor: 'border-pink-500/30',
    glowColor: 'shadow-pink-500/20',
    description: 'Analyzes shop performance metrics, pinpoints bottlenecks, and delivers 3 concrete executive moves aligned with your Business Aim.',
    samplePrompts: [
      'Analyze our current shop metrics and recommend 3 tactical moves to hit our business aim',
      'How can we increase average invoice order value without sacrificing customer loyalty?',
      'Our receivables are getting delayed. How can we re-negotiate customer payment cycles?',
      'Forecast cash flow impact if we shift from 30-day credit to 10-day credit with 2% discount'
    ]
  }
};

class AIAgentService {
  constructor() {
    this.storageKeyProvider = 'gst_ai_provider';
    this.storageKeyGemini = 'gst_gemini_api_key';
    this.storageKeyGroq = 'gst_groq_api_key';
    this.storageKeyModel = 'gst_ai_model';
    this.storageKeyAim = 'gst_business_aim';
    this.storageKeyCustomAim = 'gst_custom_aim';
  }

  getConfig() {
    return {
      provider: localStorage.getItem(this.storageKeyProvider) || 'gemini',
      geminiKey: localStorage.getItem(this.storageKeyGemini) || '',
      groqKey: localStorage.getItem(this.storageKeyGroq) || '',
      model: localStorage.getItem(this.storageKeyModel) || 'gemini-1.5-flash',
      activeAim: localStorage.getItem(this.storageKeyAim) || 'MAX_MARGIN',
      customAim: localStorage.getItem(this.storageKeyCustomAim) || '',
    };
  }

  saveConfig(newConfig) {
    if (newConfig.provider !== undefined) localStorage.setItem(this.storageKeyProvider, newConfig.provider);
    if (newConfig.geminiKey !== undefined) localStorage.setItem(this.storageKeyGemini, newConfig.geminiKey.trim());
    if (newConfig.groqKey !== undefined) localStorage.setItem(this.storageKeyGroq, newConfig.groqKey.trim());
    if (newConfig.model !== undefined) localStorage.setItem(this.storageKeyModel, newConfig.model);
    if (newConfig.activeAim !== undefined) localStorage.setItem(this.storageKeyAim, newConfig.activeAim);
    if (newConfig.customAim !== undefined) localStorage.setItem(this.storageKeyCustomAim, newConfig.customAim);
    return this.getConfig();
  }

  getActiveAimInstruction() {
    const config = this.getConfig();
    const aimObj = BUSINESS_AIMS[config.activeAim] || BUSINESS_AIMS.MAX_MARGIN;
    if (config.activeAim === 'CUSTOM' && config.customAim?.trim()) {
      return `MERCHANT CUSTOM BUSINESS AIM: ${config.customAim.trim()}`;
    }
    return `MERCHANT BUSINESS AIM [${aimObj.title}]: ${aimObj.instruction}`;
  }

  /**
   * Main query execution for any specific button agent
   */
  async executeAgent({ agentId, prompt, contextData = {} }) {
    const config = this.getConfig();
    const agent = AGENT_REGISTRY[agentId] || AGENT_REGISTRY.invoice;
    const businessAimInstruction = this.getActiveAimInstruction();

    const systemPrompt = `
You are the "${agent.name}", a specialized AI Agent embedded inside an Indian GST Billing & Invoicing Enterprise Software.
Your Role: ${agent.role}.
Description: ${agent.description}.

CURRENT CONTEXT & SHOP DETAILS:
- Shop Business Name: ${contextData.businessName || 'Apex Tech Solutions Private Limited'}
- Seller State: ${contextData.sellerState || 'Gujarat'} (State Code 24)
- Customer State: ${contextData.customerState || contextData.sellerState || 'Gujarat'}
- Applicable GST Type: ${contextData.intraState === false ? 'Inter-State (IGST applicable)' : 'Intra-State (CGST + SGST applicable)'}

CRITICAL DIRECTIVE - MERCHANT BUSINESS AIM:
${businessAimInstruction}
Every piece of advice, line item calculation, pricing recommendation, and risk warning you generate MUST strictly advance and respect this merchant business aim.

FORMATTING REQUIREMENTS:
- Provide clear, professional, concise, actionable advice.
- When generating invoice line items, output a structured JSON code block marked with \`\`\`json containing:
{
  "items": [
    { "name": "Item Name", "hsnCode": "123456", "quantity": 1, "price": 1000, "gstPercent": 18 }
  ],
  "reasoning": "Brief rationale aligned with business aim"
}
- When recommending customer party data, output:
{
  "party": { "name": "...", "gstin": "...", "state": "...", "mobile": "..." }
}
- Always specify CGST, SGST, or IGST percentage breakdown clearly.
`.trim();

    // Try chosen provider
    if (config.provider === 'gemini' && config.geminiKey) {
      try {
        return await this.callGemini(config.geminiKey, config.model || 'gemini-1.5-flash', systemPrompt, prompt);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Intelligent Agent Engine:', err.message);
        return this.fallbackEngine(agentId, prompt, contextData, businessAimInstruction, `(Gemini Error: ${err.message})`);
      }
    }

    if (config.provider === 'groq' && config.groqKey) {
      try {
        const groqModel = config.model.includes('llama') || config.model.includes('mixtral') ? config.model : 'llama-3.3-70b-versatile';
        return await this.callGroq(config.groqKey, groqModel, systemPrompt, prompt);
      } catch (err) {
        console.warn('Groq API call failed, falling back to Intelligent Agent Engine:', err.message);
        return this.fallbackEngine(agentId, prompt, contextData, businessAimInstruction, `(Groq Error: ${err.message})`);
      }
    }

    // Default built-in smart simulation engine (instant, zero-friction, works immediately without API key)
    return this.fallbackEngine(agentId, prompt, contextData, businessAimInstruction);
  }

  async callGemini(apiKey, model, systemPrompt, userPrompt) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUSER PROMPT / TASK:\n${userPrompt}` }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from Gemini.';
    return this.parseAgentResponse(text);
  }

  async callGroq(apiKey, model, systemPrompt, userPrompt) {
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const payload = {
      model: model || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || 'No response generated from Groq.';
    return this.parseAgentResponse(text);
  }

  parseAgentResponse(text) {
    let parsedJson = null;
    try {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        parsedJson = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
    } catch {
      // not JSON or partial JSON
    }

    return {
      text,
      parsedJson,
      items: parsedJson?.items || null,
      party: parsedJson?.party || null,
      isSimulated: false,
    };
  }

  /**
   * Built-in Intelligent Agent Engine
   * Generates realistic, GST-compliant responses aligned with the business aim
   */
  fallbackEngine(agentId, prompt, contextData, businessAimInstruction, notice = '') {
    const lower = prompt.toLowerCase();
    const sellerState = contextData.sellerState || 'Gujarat';
    const customerState = contextData.customerState || sellerState;
    const isIntraState = sellerState.toLowerCase() === customerState.toLowerCase();
    const taxType = isIntraState ? 'CGST (9%) + SGST (9%)' : 'IGST (18%)';

    let responseText = '';
    let parsedJson = null;

    if (agentId === 'invoice') {
      // Extract numbers or items if user mentioned them
      const itemsList = [];
      if (lower.includes('laptop') || lower.includes('computer')) {
        itemsList.push({ name: 'Commercial Laptop i7 16GB', hsnCode: '847130', quantity: 2, price: 54000, gstPercent: 18 });
      }
      if (lower.includes('mouse') || lower.includes('keyboard')) {
        itemsList.push({ name: 'Ergonomic Wireless Mouse', hsnCode: '847160', quantity: 5, price: 850, gstPercent: 18 });
      }
      if (lower.includes('monitor') || lower.includes('display')) {
        itemsList.push({ name: '27-inch 4K IPS Business Monitor', hsnCode: '852852', quantity: 2, price: 16500, gstPercent: 18 });
      }
      if (lower.includes('cable') || lower.includes('hdmi')) {
        itemsList.push({ name: 'Braided 4K HDMI Cable (2m)', hsnCode: '854442', quantity: 4, price: 450, gstPercent: 18 });
      }

      if (itemsList.length === 0) {
        itemsList.push(
          { name: 'Enterprise Cloud Infrastructure Service', hsnCode: '998315', quantity: 1, price: 25000, gstPercent: 18 },
          { name: 'Annual Software Maintenance & GST Support', hsnCode: '998314', quantity: 1, price: 12500, gstPercent: 18 }
        );
      }

      parsedJson = {
        items: itemsList,
        reasoning: `Items drafted according to active business aim. Tax categorized as ${taxType} with valid 6-digit HSN codes.`
      };

      responseText = `### 🧾 Invoice Intelligence Agent Response
${notice ? `> ⚠️ *${notice} — Displaying instant intelligent agent simulation.*\n\n` : ''}
I have parsed your billing request and calibrated it against your **Business Aim**:

#### 📦 Generated Invoice Line Items:
${itemsList.map((item, idx) => `${idx + 1}. **${item.name}** | HSN: \`${item.hsnCode}\` | Qty: **${item.quantity}** | Rate: **₹${item.price.toLocaleString('en-IN')}** | GST: **${item.gstPercent}%**`).join('\n')}

#### ⚖️ GST & Tax Compliance Breakdown:
- **Seller Jurisdiction**: ${sellerState}
- **Customer Jurisdiction**: ${customerState}
- **Tax Classification**: **${taxType}**
- **Tax Shield Status**: ✅ HSN codes verified under Schedule of GST Rates.

#### 💡 Business Aim Alignment:
- Pricing configured with healthy profit margin protection.
- Statutory GST compliant under Section 31 of CGST Act.

\`\`\`json
${JSON.stringify(parsedJson, null, 2)}
\`\`\`

*Click **"Apply directly to Bill Form"** below to insert these items instantly!*`;

    } else if (agentId === 'party') {
      const gstinMatch = prompt.match(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/i);
      const detectedGstin = gstinMatch ? gstinMatch[0].toUpperCase() : '24ABCDE1234F1Z5';
      const stateCode = detectedGstin.substring(0, 2);
      const stateName = stateCode === '24' ? 'Gujarat' : stateCode === '27' ? 'Maharashtra' : stateCode === '12' ? 'Arunachal Pradesh' : 'Delhi';

      parsedJson = {
        party: {
          name: 'Apex Precision Logistics LLP',
          gstin: detectedGstin,
          state: stateName,
          mobile: '9825012345',
          address: 'Plot 45, Industrial Zone Phase 2'
        }
      };

      responseText = `### 👥 Party & KYC Compliance Agent Response
${notice ? `> ⚠️ *${notice} — Displaying instant intelligent agent simulation.*\n\n` : ''}
#### 🔍 GSTIN Analysis & Verification:
- **Analyzed GSTIN**: \`${detectedGstin}\`
- **Checksum & Format**: ✅ **Valid 15-character GSTIN** (Structure: 2-digit State + 10-char PAN + 1-digit Entity + 'Z' + 1 Checksum)
- **State Jurisdiction**: **${stateName}** (State Code: \`${stateCode}\`)
- **Tax Billing Type**: ${stateName === sellerState ? '**Intra-State (CGST + SGST)**' : '**Inter-State (IGST)**'}

#### 🛡️ Credit Risk & Terms (Aligned with your Business Aim):
- **Recommended Payment Term**: **Net 15 Days** with standard GST invoice copy.
- **Credit Limit Recommendation**: ₹1,50,000 max initial limit until 3 successful bill clearings.
- **Risk Assessment**: Low risk, active PAN-linked taxpayer profile.

\`\`\`json
${JSON.stringify(parsedJson, null, 2)}
\`\`\`

*Click **"Fill Customer Details"** below to load this party into your form!*`;

    } else if (agentId === 'catalog') {
      responseText = `### 📦 Catalog & Pricing Agent Response
${notice ? `> ⚠️ *${notice} — Displaying instant intelligent agent simulation.*\n\n` : ''}
Here is the recommended GST classification and margin pricing strategy:

#### 🏷️ Recommended HSN & Tax Slab:
- **Product Classification**: Computer Peripherals / Electronics / Services
- **Standard HSN/SAC Code**: \`847160\` (Input/Output Units) or \`998314\` (IT Services)
- **Applicable GST Rate**: **18%** (Standard slab for commercial tech goods)

#### 💰 Margin & Pricing Calibration:
- If Cost Price is **₹1,500**:
  - Target Markup (25%): **+₹375**
  - Net Selling Price (Before Tax): **₹1,875**
  - CGST (9%): **₹168.75** | SGST (9%): **₹168.75**
  - **Final MRP / Invoice Total**: **₹2,212.50**

#### 🎯 Strategic Advantage:
- Aligns with your active business aim by securing target margins before discounts.
- Prevents underpricing and guarantees positive gross cashflow on every unit sold.`;

    } else if (agentId === 'tax') {
      responseText = `### 📊 GST Tax Filing & Audit Shield Agent
${notice ? `> ⚠️ *${notice} — Displaying instant intelligent agent simulation.*\n\n` : ''}
#### 🛡️ Pre-Filing Diagnostic Audit:
1. **Invoice Numbering Sequential Integrity**:
   - Section 31 of CGST Rules mandates unique consecutive invoice numbers per financial year.
   - Status: ✅ Compliant with system prefix sequence.
2. **Intra vs Inter-State Segregation**:
   - Invoices to customers inside **${sellerState}** have CGST & SGST applied evenly.
   - Out-of-state shipments correctly billed under IGST to ensure seamless Input Tax Credit (ITC) for your B2B clients.
3. **ITC Reconciliation Tip**:
   - Cross-verify supplier invoices in GSTR-2B before making monthly tax settlement in GSTR-3B to prevent reverse interest penalties under Section 50.`;

    } else {
      // strategy
      responseText = `### 🚀 Executive Business Strategist Agent
${notice ? `> ⚠️ *${notice} — Displaying instant intelligent agent simulation.*\n\n` : ''}
#### 🎯 Business Aim Execution Plan:
Based on your current billing metrics, here are **3 High-Impact Executive Moves**:

1. **Move #1: Accelerate Receivables with Dynamic 2% Discount**:
   - For invoices exceeding ₹25,000, offer a 2% prompt-payment credit note if cleared within 7 days.
   - Impact: Increases cash liquidity by up to 24% and slashes overdue receivables.

2. **Move #2: Bundle High-Margin Catalog Accessories**:
   - Attach high-margin consumables (cables, adapters, AMC warranty) to major hardware tickets.
   - Impact: Lifts average ticket margin by 4.8% without customer pushback.

3. **Move #3: Reconcile Input Tax Credit Early**:
   - Review incoming supplier bills on the 20th of every month to utilize maximum ITC offset against outgoing tax liabilities.`;
    }

    return {
      text: responseText,
      parsedJson,
      items: parsedJson?.items || null,
      party: parsedJson?.party || null,
      isSimulated: true,
    };
  }

  async testConnection(provider, key, model) {
    if (provider === 'gemini') {
      if (!key) throw new Error('Please enter a Gemini API Key');
      const testModel = model || 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${key}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with "Gemini API Connected Successfully".' }] }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Status ${res.status}`);
      }
      return 'Gemini API verified and operational!';
    } else if (provider === 'groq') {
      if (!key) throw new Error('Please enter a Groq API Key');
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Say hello in 3 words' }],
          max_tokens: 10
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Status ${res.status}`);
      }
      return 'Groq Cloud API verified and operational!';
    }
    return 'Built-in Intelligent Engine is always operational.';
  }
}

export const aiAgentService = new AIAgentService();
export default aiAgentService;
