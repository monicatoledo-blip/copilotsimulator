export const demoBeats = {
  beat1: {
    id: 'beat1',
    triggerKeywords: ['data extension', 'C1_VentureX', 'dormant', 'create a data extension'],
    userPrompt: 'Create a Data Extension called C1_VentureX_3mDormant for high-value Venture X cardholders who haven\'t activated a rewards offer in 90 days. Fields: ContactKey (Text, primary key), EmailAddress (Email), FirstName (Text), LastName (Text), CardType (Text), RewardsBalance (Number), LastOfferClickDate (Date), AccountTenureYears (Number), CreditTier (Text), LastModifiedDate (Date). Place it in the root Data Extensions folder, not a subfolder.',
    response: {
      text: "I've created the Data Extension **C1_VentureX_3mDormant** in Marketing Cloud. Here's a summary:",
      card: {
        type: 'dataExtension',
        title: '✅ Data Extension Created',
        name: 'C1_VentureX_3mDormant',
        location: 'Root > Data Extensions',
        fields: [
          { name: 'ContactKey', type: 'Text', primaryKey: true },
          { name: 'EmailAddress', type: 'Email', primaryKey: false },
          { name: 'FirstName', type: 'Text', primaryKey: false },
          { name: 'LastName', type: 'Text', primaryKey: false },
          { name: 'CardType', type: 'Text', primaryKey: false },
          { name: 'RewardsBalance', type: 'Number', primaryKey: false },
          { name: 'LastOfferClickDate', type: 'Date', primaryKey: false },
          { name: 'AccountTenureYears', type: 'Number', primaryKey: false },
          { name: 'CreditTier', type: 'Text', primaryKey: false },
          { name: 'LastModifiedDate', type: 'Date', primaryKey: false },
        ],
        status: 'Created successfully',
        recordCount: '0 records (ready for import)',
      }
    }
  },

  beat2: {
    id: 'beat2',
    triggerKeywords: ['campaign', 'venture x rewards', 'nurture', 'two-email', 'set up', 'activation campaign', 'rewards activation'],
    userPrompt: 'Set up the Venture X rewards activation campaign for our 90-day dormant segment — build a two-email nurture (offer first, re-engagement follow-up) with a 10% rewards bonus, wire the engagement split and Einstein STO into the journey, and save it in Draft.',
    response: {
      text: "I've built the **C1 Venture X Rewards Activation Journey** in Marketing Cloud. Here's what was set up:",
      card: {
        type: 'journey',
        title: '✅ Journey Created (Draft)',
        journeyName: 'C1 Venture X Rewards Activation Journey v1',
        status: 'Draft',
        entrySource: 'C1_VentureX_3mDormant',
        steps: [
          { icon: '📧', name: 'Email 1: Rewards Offer', desc: '10% bonus activation with personalized balance' },
          { icon: '⏱️', name: 'Wait: 3 Days', desc: 'Einstein Send Time Optimization enabled' },
          { icon: '🔀', name: 'Engagement Split', desc: 'Opened vs. Did Not Open' },
          { icon: '📧', name: 'Email 2: Re-engagement', desc: 'Urgency-based follow-up for non-openers' },
        ],
        emailPreview: true,
      }
    }
  },

  beat3: {
    id: 'beat3',
    triggerKeywords: ['quicksilver', 'cashback', 'campaign perform', 'opens', 'clicks', 'performance'],
    userPrompt: 'How did the Quicksilver Summer Cashback 2026 campaign perform? Give me opens, clicks, and unsubscribes compared to benchmark.',
    response: {
      text: "Here are the performance metrics for the **Quicksilver Summer Cashback 2026** campaign:",
      card: {
        type: 'performance',
        title: '📊 Campaign Performance Report',
        campaignName: 'Quicksilver Summer Cashback 2026',
        sendDate: 'June 2 – June 16, 2026',
        totalSent: '1,247,832',
        metrics: [
          { label: 'Open Rate', value: '34.2%', benchmark: '28.5%', status: 'above', delta: '+5.7%' },
          { label: 'Click Rate', value: '8.7%', benchmark: '6.2%', status: 'above', delta: '+2.5%' },
          { label: 'Unsubscribe Rate', value: '0.12%', benchmark: '0.18%', status: 'below', delta: '-0.06%' },
          { label: 'Bounce Rate', value: '1.1%', benchmark: '1.5%', status: 'below', delta: '-0.4%' },
        ],
        insight: 'This campaign outperformed benchmarks across all key metrics. The personalized cashback tier messaging drove a 40% higher click rate than the Q1 Quicksilver campaign. Consider replicating the subject line strategy for upcoming fall campaigns.',
      }
    }
  },

  beat4: {
    id: 'beat4',
    triggerKeywords: ['compliance', 'flag', 'legal', 'review', 'approval', 'hold'],
    userPrompt: 'The journey looks good. Flag C1 Venture X Rewards Activation Journey v1 for compliance review before activation — the email includes a 10% rewards bonus offer that needs legal sign-off. Keep it in Draft and hold activation until we get approval. Link the approval queue so I can keep tabs on it.',
    response: {
      text: "I've flagged the journey for compliance review and set up the approval workflow:",
      card: {
        type: 'compliance',
        title: '⚠️ Compliance Review Initiated',
        journeyName: 'C1 Venture X Rewards Activation Journey v1',
        status: 'Draft — Held for Legal Review',
        flagReason: '10% rewards bonus offer requires legal sign-off per promotional offers policy',
        actions: [
          { icon: '🔒', text: 'Journey locked in Draft — activation blocked until approved' },
          { icon: '📋', text: 'Approval request sent to Compliance & Legal Review Queue' },
          { icon: '🔔', text: 'Notification sent to compliance-review@capitalone.com' },
          { icon: '📎', text: 'Email creative attached to review request for legal markup' },
        ],
        approvalLink: 'View Approval Queue →',
        eta: 'Typical review turnaround: 24–48 business hours',
      }
    }
  },

  reset: {
    id: 'reset',
    triggerKeywords: ['reset', 'reset the demo', 'start over', 'clear'],
    response: {
      text: "Demo has been reset. All conversations cleared — ready for a fresh run! 🔄",
      card: null,
    }
  }
}

export function matchBeat(input) {
  const lower = input.toLowerCase()

  // Check reset first
  if (demoBeats.reset.triggerKeywords.some(k => lower.includes(k))) {
    return demoBeats.reset
  }

  // Check each beat
  for (const key of ['beat1', 'beat2', 'beat3', 'beat4']) {
    const beat = demoBeats[key]
    if (beat.triggerKeywords.some(k => lower.includes(k))) {
      return beat
    }
  }

  // Default fallback
  return {
    id: 'fallback',
    response: {
      text: "I can help you with Marketing Cloud operations. Try asking me to create a data extension, set up a campaign, check performance metrics, or flag content for compliance review.",
      card: null,
    }
  }
}
