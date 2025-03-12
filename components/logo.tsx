import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/sign-up">
            <div className="hover:opacity-95 transition items-center gap-x-2  hidden md:flex">
            <Image src="/logo.svg" alt="Logo" height={30}width={30} />
            <p className="text-lg text-neutral-700 font-semibold">
            Taskify
            </p>
            </div>
        </Link>
    )
}