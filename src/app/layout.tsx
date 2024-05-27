import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ProviderReduxToolkit from './provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Juego De Rifas',
  description: 'Participa en nuestra rifa para ganar un preciado premio.¡Compra boletos para tener la oportunidad de ganar!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es">
      <meta name="theme-color" content="#001529" />
      <body className={inter.className}>
        <ProviderReduxToolkit>{children}</ProviderReduxToolkit>
      </body>
    </html>
  );
};
