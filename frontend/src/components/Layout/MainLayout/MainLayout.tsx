import { Footer } from '@/components/Layout/Footer/Footer';
import { Header } from '@/components/Layout/Header/Header';
import { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header />
      <div className="container mx-auto px-4 my-10 flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
