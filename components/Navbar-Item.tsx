import React, {useState} from 'react'
import Link from 'next/link';
import styles from "@/styles/header.module.css"

interface Props{
    mainText: string;
    link: string;
}

export const NavbarItem: React.FC<Props> = ({mainText, link}) => {
    return(<>
       <Link href={link}><h2>{mainText}</h2></Link>
    </>)
}