import Link from 'next/link';

function PageNotFound() {
   return (
      <section className="flex h-screen items-center justify-center">
         <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div className="mx-auto max-w-screen-sm text-center">
               <h1 className="text-primary-600 mb-4 text-7xl font-extrabold tracking-tight text-info lg:text-9xl">
                  404
               </h1>
               <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
                  Something&apos;s missing.
               </p>
               <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                  Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.{' '}
               </p>
               <Link href="/" className="btn btn-info text-white">
                  Back to homepage
               </Link>
            </div>
         </div>
      </section>
   );
}

export default PageNotFound;
