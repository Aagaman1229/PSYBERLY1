import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../components/ThemeToggle'; // import from the same file

export const metadata = {
  title: 'My Awesome Site',
  description: 'Built with Next.js and Supabase',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}