import React, {useState} from 'react'
import styles from "@/styles/header.module.css"
import { NavbarItem } from './Navbar-Item'


export const Header: React.FC = () => {
    return(<>
        <div className={styles.main}>
            <div className={styles.logo}>
            </div>
            <div className={styles.navbar}>
                <NavbarItem mainText="Search" link="/search"/>
                <NavbarItem mainText="Link2" link="/"/>
                <NavbarItem mainText="Link3" link="/"/>
            </div>
        </div>
    </>)
}