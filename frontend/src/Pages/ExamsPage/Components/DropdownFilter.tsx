import { useEffect, useRef, useState } from "react"
import { TiTick } from "react-icons/ti";
import { useOnClickOutside } from "usehooks-ts";

type DropdownFilterProps = {
    title: string
    items: string[]
    search?: boolean,
    update: (arr: string[]) => void
}

type Item = {
    name: string
    selected: boolean
}

const DropdownItem = ({ item, UpdateItem }: { item: Item, UpdateItem: () => void }) => {
    const handleSelectChange = () => {
        UpdateItem()
    }

    return (
        <li className="flex items-center">
              <input id="apple" type="checkbox" value="" checked={item.selected} onChange={handleSelectChange}
                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 focus:ring-2" />

          <label className="ml-2 text-sm font-medium text-gray-900">
            {item.name}
          </label>
        </li>
    )
}

const DropdownFilter = ({ title, items, search, update }: DropdownFilterProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [Search, SetSearch] = useState("")

    const [Items, SetItems] = useState<Item[]>(items.map((item) => {
       return {
            name: item,
            selected: false
       }}
    ));

    const dropdownRef = useRef(null)

    useOnClickOutside(dropdownRef, () => setIsOpen(false))

    const hasSearch = search === null ? false : search

    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const handleSearchChange = (e) => {
        SetSearch(e.target.value)
    }

    const handleSearchSubmit = () => {
        const index = Items.findIndex((item) => item.name === Search)

        if (index !== -1) {
            SetItems([
                ...Items.slice(0, index),
                {
                    name: Items[index].name,
                    selected: true
                },
                ...Items.slice(index + 1)
            ])
            return
        }

        SetItems([...Items.filter((item) => item.name !== Search), {name: Search, selected: true}])
    }

    const ChangeItemSelected = (item: Item) => {
        // Get the position of the item
        const itemPos = Items.findIndex((i) => i.name === item.name)

        SetItems([
            ...Items.slice(0, itemPos),
            {
                name: item.name,
                selected: !item.selected
            },
            ...Items.slice(itemPos + 1)
        ])
    }

    useEffect(() => {
        update(Items.filter((item) => item.selected).map((item) => item.name))
    }, [Items])

    return (
        <div ref={dropdownRef}>
            <button id="dropdownDefault" data-dropdown-toggle="dropdown"
               className="text-black bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
               type="button" onClick={toggle}>
               {title}
               <svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div id="dropdown" className={(isOpen ? "" : "hidden ") + "absolute z-10 w-56 p-3 bg-white rounded-lg shadow"}>
                {
                    (hasSearch) ? 
                    <div className="flex py-2 space-x-3">
                        <input type="text" onChange={handleSearchChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder={"Search " + title.toLowerCase() + "..."} />
                        <TiTick className="m-auto cursor-pointer" size={22} onClick={handleSearchSubmit}/>
                    </div>
                    : null
                }
                <ul className="space-y-2 text-sm pt-3 border-t overflow-auto max-h-48" aria-labelledby="dropdownDefault">
                {
                    Items.map((item, index) => (
                        <DropdownItem item={item} key={index} UpdateItem={
                            () => ChangeItemSelected(item)
                        }/>
                    ))
                }
                </ul>
            </div>
        </div>
    )
}

export default DropdownFilter