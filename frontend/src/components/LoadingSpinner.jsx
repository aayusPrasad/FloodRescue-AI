export default function LoadingSpinner({ message = 'Analyzing image...' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-mint border-t-brand-teal" />
      <p className="text-sm font-medium text-brand-ocean">{message}</p>
    </div>
  )
}