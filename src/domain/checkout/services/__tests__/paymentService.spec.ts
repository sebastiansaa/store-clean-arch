import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPaymentIntent, completeCheckout } from '../paymentService'
import { serverAdapter } from '../../../../shared/api/serverAdapter'
import { logger } from '../../../../shared/services/logger'
import { normalizeApiError } from '../../../../shared/helpers/error'
import { CreatePaymentIntentResponseSchema, CompleteCheckoutResponseSchema } from '../../schema/paymentResponses'

vi.mock('../../../../shared/api/serverAdapter')
vi.mock('../../../../shared/services/logger')
vi.mock('../../../../shared/helpers/error')

const mockServerAdapter = vi.mocked(serverAdapter)
const mockLogger = vi.mocked(logger)
const mockNormalizeApiError = vi.mocked(normalizeApiError)

import type { AxiosResponse } from 'axios'

const mockAxiosResponse = (data: unknown): AxiosResponse => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {
    headers: {} as never
  },
})

mockServerAdapter.post.mockImplementation(() => Promise.resolve(mockAxiosResponse({})))
mockLogger.debug.mockImplementation(() => { })
mockLogger.info.mockImplementation(() => { })
mockLogger.error.mockImplementation(() => { })
mockNormalizeApiError.mockImplementation((e: unknown) => ({ message: e instanceof Error ? e.message : 'unknown' }))

vi.mock('../../schema/paymentResponses', () => ({
  CreatePaymentIntentResponseSchema: { safeParse: vi.fn() },
  CompleteCheckoutResponseSchema: { safeParse: vi.fn() }
}))

let mockForceMockPayments = false
vi.mock('../../../../shared/config/config', () => ({
  get FORCE_MOCK_PAYMENTS() { return mockForceMockPayments }
}))

describe('paymentService', () => {
  beforeEach(() => {
    mockForceMockPayments = false
    vi.clearAllMocks()
  })

  describe('createPaymentIntent', () => {
    it('returns mock client_secret when FORCE_MOCK_PAYMENTS is true', async () => {
      mockForceMockPayments = true
      const result = await createPaymentIntent(100)
      expect(result.client_secret).toMatch(/^cs_mock_/)
    })

    it('calls serverAdapter and validates schema on success', async () => {
      // mockForceMockPayments = false
      const mockResponse = { client_secret: 'cs_123' }
      mockServerAdapter.post.mockResolvedValue(mockAxiosResponse(mockResponse))
        ; vi.mocked(CreatePaymentIntentResponseSchema.safeParse).mockReturnValue({ success: true, data: mockResponse })

      const result = await createPaymentIntent(200, 'usd')
      console.log('mockPost calls:', mockServerAdapter.post.mock.calls)
      expect(mockServerAdapter.post).toHaveBeenCalledWith('/api/create-payment-intent', { amount: 200, currency: 'usd' })
      expect(result).toEqual(mockResponse)
    })

    it('throws normalized error when server call fails', async () => {
      // mockForceMockPayments = false
      mockServerAdapter.post.mockRejectedValue(new Error('Network error'))
        ; vi.mocked(CreatePaymentIntentResponseSchema.safeParse).mockReturnValue({
          success: false,
          error: { issues: [], format: () => ({}) } as never
        })

      await expect(createPaymentIntent(50)).rejects.toThrow('Network error')
    })
  })

  describe('completeCheckout', () => {
    const payload = { customer: { email: 'test@example.com' }, paymentMethodId: 'pm_123' }

    it('returns mock response when FORCE_MOCK_PAYMENTS is true', async () => {
      mockForceMockPayments = true
      const result = await completeCheckout(payload)
      expect(result.success).toBe(true)
      expect(result.orderId).toMatch(/^order_mock_/)
    })

    it('calls serverAdapter and validates schema on success', async () => {
      // mockForceMockPayments = false
      const mockResp = { success: true, orderId: 'order_456' }
      mockServerAdapter.post.mockResolvedValue(mockAxiosResponse(mockResp))
        ; vi.mocked(CompleteCheckoutResponseSchema.safeParse).mockReturnValue({ success: true, data: mockResp })

      const result = await completeCheckout(payload)
      expect(mockServerAdapter.post).toHaveBeenCalledWith('/api/complete-checkout', payload)
      expect(result).toEqual(mockResp)
    })

    it('throws normalized error on failure', async () => {
      // mockForceMockPayments = false
      mockServerAdapter.post.mockRejectedValue(new Error('Server error'))
        ; vi.mocked(CompleteCheckoutResponseSchema.safeParse).mockReturnValue({
          success: false,
          error: { issues: [], format: () => ({}) } as never
        })

      await expect(completeCheckout(payload)).rejects.toThrow('Server error')
    })
  })
})
