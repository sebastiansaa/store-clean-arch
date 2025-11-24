import { describe, it, expect, vi } from 'vitest'
import { autoTokenizeCard } from '../cardTokenization'
import { TokenizeReasons } from '../../types/reasons'
import type { CardFormRef } from '../../interfaces/types'

interface MockCardForm {
  tokenizePayload: ReturnType<typeof vi.fn>
}

describe('autoTokenizeCard', () => {
  it('returns NO_FORM if form is missing', async () => {
    const result = await autoTokenizeCard(null)
    expect(result).toEqual({ ok: false, reason: TokenizeReasons.NO_FORM })
  })

  it('returns NO_TOKEN if tokenizePayload returns undefined', async () => {
    const mockForm: MockCardForm = { tokenizePayload: vi.fn().mockResolvedValue(undefined) }
    const result = await autoTokenizeCard(mockForm as unknown as CardFormRef)
    expect(result).toEqual({ ok: false, reason: TokenizeReasons.NO_TOKEN })
  })

  it('returns FAILED if tokenizePayload returns error', async () => {
    const error = new Error('Some error')
    const mockForm: MockCardForm = { tokenizePayload: vi.fn().mockResolvedValue({ error }) }
    const result = await autoTokenizeCard(mockForm as unknown as CardFormRef)
    expect(result).toEqual({ ok: false, reason: TokenizeReasons.FAILED, error })
  })

  it('returns ok with payload on success', async () => {
    const payload = { token: 'tok_123' }
    const mockForm: MockCardForm = { tokenizePayload: vi.fn().mockResolvedValue(payload) }
    const result = await autoTokenizeCard(mockForm as unknown as CardFormRef)
    expect(result).toEqual({ ok: true, payload })
  })

  it('catches unexpected errors', async () => {
    const error = new Error('Unexpected')
    const mockForm: MockCardForm = { tokenizePayload: vi.fn().mockRejectedValue(error) }
    const result = await autoTokenizeCard(mockForm as unknown as CardFormRef)
    expect(result).toEqual({ ok: false, reason: TokenizeReasons.FAILED, error })
  })
})
