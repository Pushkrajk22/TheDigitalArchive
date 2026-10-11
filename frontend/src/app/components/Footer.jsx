import { Mail } from 'lucide-react';

export default function Footer() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  // return (
  //   <footer className="mt-auto border-t border-[#8C6239]/15 bg-[#FFFDF5]/80 dark:border-[#F5E6BE]/10 dark:bg-[#1C1410]/80">
  //     <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
  //       <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
  //         <p className="max-w-prose text-xs leading-relaxed text-[#8C6239]/60 dark:text-[#F5E6BE]/40">
  //           All content hosted here is shared for devotional and educational purposes only.
  //           The host makes no claim of copyright ownership over any material.
  //           If you are the rightful owner of any content and wish it to be removed,
  //           please reach out and it will be taken down promptly.
  //         </p>

  //         {email && (
  //           <a
  //             href={`mailto:${email}`}
  //             className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#8C6239]/25 bg-[#8C6239]/6 px-3.5 py-1.5 text-xs font-medium text-[#8C6239] transition-all duration-200 hover:border-[#8C6239]/45 hover:bg-[#8C6239]/12 dark:border-[#F5E6BE]/15 dark:bg-[#F5E6BE]/5 dark:text-[#F5E6BE]/75 dark:hover:border-[#F5E6BE]/30 dark:hover:bg-[#F5E6BE]/10"
  //           >
  //             <Mail size={13} />
  //             Contact Us
  //           </a>
  //         )}
  //       </div>
  //     </div>
  //   </footer>
  // );
}
