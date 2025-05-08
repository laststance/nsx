import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import React, { memo } from 'react'

import { concatSelecor } from '@/src/lib/concatSelecor'

import Footer from './Footer'
import Header from './Header'

interface LayoutProps {
  disableBaseStyle?: boolean
}

const Layout = memo<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
    LayoutProps
>(
  ({ children, className, disableBaseStyle, ...props }) => {
    let baseStyle = 'container mx-auto grow px-4 py-4'

    if (className && !disableBaseStyle) {
      baseStyle = concatSelecor(baseStyle, className)
    } else if (className && disableBaseStyle) {
      baseStyle = className
    } else if (!className && disableBaseStyle) {
      baseStyle = ''
    }

    return (
      <div
        className="bg-primary flex min-h-screen w-full flex-col justify-between"
        {...props}
      >
        <Header />
        <main className={baseStyle}>{children}</main>
        <Footer />
      </div>
    )
  },
  () => true,
)
Layout.displayName = 'Layout'

export default Layout
