interface PageContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'wide'
}

export default function PageContainer({
  children,
  className = '',
  size = 'default',
}: PageContainerProps) {
  const maxWidth = size === 'wide' ? 'max-w-6xl' : 'max-w-4xl'

  return (
    <div className={`mx-auto w-full ${maxWidth} px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
