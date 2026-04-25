// test-paystack.js (temporary — run with `node test-paystack.js`)

const secret = 'sk_test_234039cf6049f1cb070ad778c7031bd113d5b936'

async function testPaystack() {
  try {
    // Test 1: Balance check (simplest endpoint)
    const balanceRes = await fetch('https://api.paystack.co/balance', {
      headers: { Authorization: `Bearer ${secret}` },
    })
    
    const balanceData = await balanceRes.json()
    console.log('Balance check:', {
      status: balanceRes.status,
      data: balanceData,
    })

    // Test 2: Initialize a test transaction
    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        amount: 10000, // 100 KES in kobo
        currency: 'KES',
        callback_url: 'https://www.tefetro.studio/checkout/success',
      }),
    })

    const initData = await initRes.json()
    console.log('Initialize test:', {
      status: initRes.status,
      data: initData,
    })

  } catch (err) {
    console.error('Error:', err.message)
  }
}

testPaystack()