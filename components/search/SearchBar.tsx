import React, {useEffect, useState, useRef} from 'react'
import { searchType } from '@/interfaces'

interface Props{
    setSearchValue: (searchValue: string) => void,
    setSearchType: (searchType:searchType) => void
}

export const SearchBar: React.FC<Props> = ({setSearchValue, setSearchType}) => {

    return(<>
        <input type="text" onInput={e=>{setSearchValue(e.currentTarget.value)}}/>
        <select onChange={e=>{setSearchType(e.currentTarget.value as searchType)}}>
            <option value="album">album</option>
            <option value="artist">artist</option>
        </select>
    </>)
}