import Navbar from '../ui/Navbar';

export default function Page({ children }) {
   return (
      <div>
         <Navbar />
         <main>{children}</main>
      </div>
   );
}
