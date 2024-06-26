/* eslint-disable @next/next/no-img-element */
"use client"
import { Vollkorn, Poppins } from "next/font/google";

const vollkorn = Vollkorn({ subsets: ["latin"] })
const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] },)

import React, { useState, useContext, useEffect } from "react";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import Link from "next/link";
import Links from "./links";
import { FaBars } from "react-icons/fa";
import { FaChevronDown, FaXmark } from "react-icons/fa6";
import { FaExclamation } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import LOGO from "../app/images/eva.png"
import Image from "next/image";
import { AuthContext } from "@/contexts/authContext";
import { CartContext } from "@/contexts/cartContext";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { auth } from "@/firebase.config";

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

const divVariant = {
    initial: {
        opacity: 0,
        scale: 0,
        borderRadius: "0 0 0 100%",
    },
    final: {
        opacity: 1,
        scale: 1,
        borderRadius: "0",
        transition: {
            duration: 0.3
        }
    }
}

const ulVariant = {
    initial: {
        opacity: 0,
    },
    final: {
        opacity: 1,
        transition: {
            duration: 0.5, delayChildren: 0.5, staggerChildren: 0.3, when: "beforeChildren"
        }
    }
}

const liVariant = {
    initial: {
        opacity: 0,
        y: "-50px"
    },
    final: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3
        }
    }
}

const Header = () => {
    const { user, logOut, userToken, currentUser } = useContext(AuthContext)
    console.log(currentUser)
    const [nav, setNav] = useState(false)
    const pathname = usePathname()
    const [subNav, setSubNav] = useState(false)
    const [subNav2, setSubNav2] = useState(false)
    const { cartItem } = useContext(CartContext)
    const router = useRouter()
    const openSubNav = () => {
        setSubNav(prev => !prev)
        setSubNav2(false)
    }
    const openSubNav2 = () => {
        setSubNav2(prev => !prev)
        setSubNav(false)
    }
    const profile = () => {
        if (!user) {
            toast.error(<p className="text-center font-semibold text-sm">You are not logged in Now <br /> But you be redirected to the Login Page</p>, {
                icon: <FaExclamation color="red" />,
                position: "top-center",
                duration: 4000,
            })
            router.push("/login")
        } else {
            router.push("/profile");
        }
    }


    return (
        <header className={`${vollkorn.className} lg:px-20 px-6 bg-[#E8DFD6] fixed w-full left-0 top-0 right-0 flex items-center justify-between z-[9999]`}>
            <div className="xl:block hidden"><Link href="/"><Image src={LOGO} width={60} height={60} style={{ width: "auto" }} alt="LOGO" /></Link></div>
            <div className="xl:hidden block"><Link href="/"><Image src={LOGO} width={40} height={40} style={{ width: "auto" }} alt="LOGO" /></Link></div>
            <nav className="xl:block hidden">
                <Links />
            </nav>
            <div className="md:flex hidden items-center gap-4 md:gap-10">
                <div className="relative">
                    <input className="pl-10 border-2 border-black h-9 md:h-12 bg-transparent" type="text" placeholder="Search" />
                    <IoMdSearch className="absolute left-5 top-1/2 -translate-y-1/2" size={20} />
                </div>
                {!cartItem.length ?
                    <Drawer>
                        <DrawerTrigger>
                            <div className="relative">
                                <MdOutlineShoppingBag size={30} />
                                <span className="w-6 aspect-square flex justify-center items-center bg-black text-white absolute -top-1 -right-1 rounded-full">{cartItem.length}</span>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <div className="mx-auto text-center font-semibold leading-5">
                                    <DrawerTitle>No Item in Your Cart Now!!</DrawerTitle>
                                    <DrawerDescription>Would you like to go through our products?.</DrawerDescription>
                                </div>
                            </DrawerHeader>
                            <DrawerFooter className="mx-auto">
                                <Button className=""><Link href="/wigs">Yes</Link></Button>
                                <DrawerClose>
                                    <Button variant="outline" className="" >Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    :
                    <Link href="/cart">
                        <div className="relative">
                            <MdOutlineShoppingBag size={30} />
                            <span className="w-6 aspect-square flex justify-center items-center bg-black text-white absolute -top-1 -right-1 rounded-full">{cartItem.length}</span>
                        </div>
                    </Link>
                }
                <div className="flex items-center gap-2">
                    {/* <FaUser className="cursor-pointer" color="#000" onClick={() => profile()} size={20} /> */}
                    <img src={currentUser?.photoURL} className="w-9 aspect-square rounded-full" alt="" />
                    {currentUser?.uid === "ojIdM00XIRNKBZs848B0cMo8qMu2" && <Link className="font-semibold" href="/dashboard">Admin</Link>}
                </div>
                {(userToken) &&
                <div> 
                    <button onClick={logOut} className={`${poppins.className} lg:block hidden w-full rounded-sm hover:bg-red-600 duration-300 bg-red-500 py-2 px-3 font-medium text-white text-base`}>LOGOUT</button>
                </div>}
            </div>
            <motion.div className={`${nav ? "static" : "relative"} cursor-pointer bg-black p-2 rounded-md lg:hidden block`}>
                <AnimatePresence>
                    {nav ?
                        <div className="z-[9999999] text-base lg:text-xl md:text-2xl relative border-2 border-black" onClick={() => setNav(prev => !prev)}>
                            <FaXmark color="white" size={20} />
                        </div>
                        :
                        <div>
                            <div className="z-[9999999] text-base lg:text-xl md:text-2xl relative border-2 border-black" onClick={() => setNav(prev => !prev)}>
                                <FaBars color="white" size={20} />
                            </div>
                        </div>
                    }
                </AnimatePresence>
                <motion.div variants={divVariant} initial="initial" animate={nav ? "final" : "initial"} className={`min-h-fit fixed ${nav ? "" : ""} inset-0 bg-black text-white origin-top-right duration-300`}>
                    <motion.ul variants={ulVariant} className="font-bold md:font-semibold p-4 md:text-xl min-h-screen flex flex-col justify-between">
                        <motion.li className="flex gap-4 items-center">
                            <Link href="/cart">
                                <div className="relative">
                                    <MdOutlineShoppingBag size={30} color="white" />
                                    <span className="w-6 aspect-square flex justify-center items-center bg-white text-black absolute left-0 top-0 rounded-full">{cartItem.length}</span>
                                </div>
                            </Link>
                            <div className="flex items-center gap-2">
                                <FaUser className="cursor-pointer" color="#fff" onClick={() => profile()} size={20} />
                                {currentUser?.uid === "ojIdM00XIRNKBZs848B0cMo8qMu2" && <Link className="font-semibold" href="/dashboard">Admin</Link>}
                            </div>
                        </motion.li>
                        <motion.li onClick={() => openSubNav()} variants={liVariant}><span className="relative px-3 flex items-center gap-1">Shop<FaChevronDown /></span>
                            <AnimatePresence>
                                {subNav &&
                                    <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "100%", opacity: 1 }} exit={{ x: "-100px", opacity: 0 }} className={`z-10 flex flex-col justify-between gap-5 py-3 px-4 transition-all duration-300 overflow-hidden`}>
                                        <Link href="/wigs">Wig</Link>
                                        <Link href="/bundles">Bundle</Link>
                                    </motion.ul>}
                            </AnimatePresence>
                        </motion.li>
                        <motion.li onClick={() => openSubNav2()} variants={liVariant}><span className="relative px-3 flex items-center gap-1">Our Services<FaChevronDown /></span>
                            <AnimatePresence>
                                {subNav2 && 
                                <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "100%", opacity: 1 }} exit={{ x: "-100px", opacity: 0 }} className={`py-3 z-10 transition-all duration-300 px-4 overflow-hidden`}>
                                    <Link href="/makeup">MakeUp</Link>
                                </motion.ul>}
                            </AnimatePresence>
                        </motion.li>
                        <motion.li variants={liVariant}><Link className={`${pathname === "/gallery" && "nav-others"} nav-active px-3 py-3`} href="/gallery">Gallery</Link></motion.li>
                        <motion.li variants={liVariant}><Link className={`${pathname === "/about" && "nav-others"} nav-active px-3 py-3`} href="/about">About Us</Link></motion.li>
                        <motion.li variants={liVariant}><Link className={`${pathname === "/contact" && "nav-others"} nav-active px-3 py-3`} href="/contact">Contact Us</Link></motion.li>
                        <motion.li variants={liVariant} className="relative">
                            <input className="w-full pl-5 md:pl-10 h-10 md:h-14 text-black" type="text" name="" id="" placeholder="Search" />
                            <IoMdSearch className="absolute left-5 top-1/2 -translate-y-1/2" size={20} />
                        </motion.li>
                        {(userToken) ?
                            (<motion.li variants={liVariant} whileTap={{ scale: 0.8 }}>
                                <button onClick={logOut} className="w-full rounded-sm hover:bg-red-600 hover:text-white duration-300 bg-red-500 my-3 py-2 px-2 font-semibold text-white text-base md:text-base">LOGOUT</button>
                            </motion.li>) :
                            (
                                <>
                                    <motion.li variants={liVariant} whileTap={{ scale: 0.95 }}>
                                        <Link href="/login">
                                            <button className="w-full rounded-sm border-2 hover:bg-[#7F6000] hover:text-white duration-300 py-2 px-2 font-semibold text-white text-base md:text-base border-[#7F6000]">LOGIN</button>
                                        </Link>
                                    </motion.li>
                                    <motion.li variants={liVariant} whileTap={{ scale: 0.95 }}>
                                        <Link href="/createAccount">
                                            <button className="w-full rounded-sm border-2 border-[#7F6000] hover:bg-transparent hover:text-white duration-300 py-2 px-2 font-semibold text-white text-base md:text-base bg-[#7F6000]">SIGNUP</button>
                                        </Link>
                                    </motion.li>
                                </>
                            )}
                    </motion.ul>
                </motion.div>
            </motion.div>
        </header>
    )
}

export default Header;