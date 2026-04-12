type Props = {
  total: number
  paid: number
}

export default function PaymentSummary({ total, paid }: Props) {
  const balance = total - paid

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-3">Payments</h2>

      <p>Total: KES {total}</p>
      <p>Paid: KES {paid}</p>
      <p className="text-red-500 font-medium">
        Balance: KES {balance}
      </p>

      {balance > 0 && (
        <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded">
          Pay Now
        </button>
      )}
    </div>
  )
}