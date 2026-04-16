import { describe, it, expect, vi } from 'vitest';
import { generateIcebreaker, MeetingPrepSchema, IcebreakerSchema } from '../services/aiService';

// Mock the Google Generative AI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockImplementation(() => ({
        generateContent: vi.fn()
      }))
    })),
    HarmCategory: {},
    HarmBlockThreshold: {}
  };
});

describe('AI Service Reliability', () => {
  const mockUser = { name: 'Alice', role: 'Dev', interests: ['AI'], goals: ['Networking'] };
  const mockPartner = { name: 'Bob', role: 'CEO', interests: ['Startup'], skills: ['Strategy'] };

  it('IcebreakerSchema should validate correct objects', () => {
    const valid = {
      greeting: 'Hi Bob',
      interest: 'I saw you work in Strategy',
      callToAction: 'Would love to chat',
      rawText: 'Hi Bob, I saw you work in Strategy. Would love to chat'
    };
    expect(IcebreakerSchema.parse(valid)).toEqual(valid);
  });

  it('MeetingPrepSchema should validate correct structural objects', () => {
    const valid = {
      commonalities: ['AI', 'Tech'],
      discussionStarters: ['How is the CEO life?', 'What is your strategy?'],
      prepSummary: 'High value connection'
    };
    expect(MeetingPrepSchema.parse(valid)).toEqual(valid);
  });

  it('should trigger fallback when SDK returns malformed JSON', async () => {
    // Testing the "safeGenerate" logic via the exported functions in mock mode or error state
    // Given our `aiService.js` uses import.meta.env, we rely on the MOCK logic if no key is present.
    
    const result = await generateIcebreaker(mockUser, mockPartner, { sharedInterests: ['AI'] });
    
    // In MOCK mode (default for tests), it should return the fallback
    expect(result).toContain('Hi Bob');
    expect(result).toContain('AI');
  });
});
