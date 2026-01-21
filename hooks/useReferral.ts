'use client'

import { useEffect, useState } from 'react'

interface ReferralData {
  referralCode: string | null
  whatsappLink: string
  showBadge: boolean
}

export function useReferral(): ReferralData {
  const [referralData, setReferralData] = useState<ReferralData>({
    referralCode: null,
    whatsappLink: 'https://wa.me/6285712054394',
    showBadge: false,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Get the ref parameter from URL
    const searchParams = new URLSearchParams(window.location.search)
    const refCode = searchParams.get('ref')

    if (refCode) {
      // Create the referral message with the ref code
      const message = `Halo%20Gan,%20saya%20mau%20order%20Jurnal%20Trading%20via%20referensi%20${encodeURIComponent(refCode)}.`
      const whatsappLink = `https://wa.me/6285712054394?text=${message}`

      setReferralData({
        referralCode: refCode,
        whatsappLink,
        showBadge: true,
      })
    }
  }, [])

  return referralData
}
