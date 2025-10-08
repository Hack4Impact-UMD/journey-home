'use client';
import {InventoryPhoto, InventoryRecord, InventoryRecordData, SearchFilters} from "@/types/inventory";
import {search, createInventoryRecord, getInventoryRecord, updateInventoryRecord, deleteInventoryRecord, sortByDate, sortByQuantity} from "@/lib/services/inventory";
import {useState} from 'react';


export default function FuncTestPage() {

    const [recordData, setRecord] = useState<InventoryRecordData>({
        name: '',
        thumbnail: {
            url: '',
            altText: '',
        },
        otherPhotos: [],
        category: '',
        notes: '',
        quantity: 0,
        dateAdded: new Date(),
    });

    const [results, setResults] = useState<InventoryRecord[]>([]);
    const [searchText, setSearchText] = useState("");
    const [filters, setFilters] = useState<SearchFilters>({
        categories: [],
        minStock: undefined,
        maxStock: undefined,
        afterDate: undefined,
        beforeDate: undefined,
    })
    const [sortOption, setSortOption] = useState(""); 

    //found how to manipulate change and submit online for forms specifically 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        //thumbnails are funky because it has subdata...
        if (name === 'thumbnailUrl') {
            setRecord(prevData => ({...prevData, thumbnail: {
                                        ...prevData.thumbnail,
                                        url: value 
                                    }
            }));
        } else if (name === 'thumbnailAlt') {
            setRecord(prevData => ({...prevData, thumbnail: {
                                        ...prevData.thumbnail,
                                        altText: value 
                                    }
            }));
        } else if (name === "quantity") {
            setRecord(prevData => ({
                ...prevData,
                [name]: Number(value)
            }));
        } else {
            setRecord(prevData => ({...prevData, [name]: value})) 
        }
    } 

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "minStock") setFilters(prev => ({ ...prev, minStock: value ? Number(value) : undefined }));
        else if (name === "maxStock") setFilters(prev => ({ ...prev, maxStock: value ? Number(value) : undefined }));
        else if (name === "beforeDate") setFilters(prev => ({ ...prev, beforeDate: value ? new Date(value) : undefined }));
        else if (name === "afterDate") setFilters(prev => ({ ...prev, afterDate: value ? new Date(value) : undefined }));
        else if (name === "category") setFilters(prev => ({ ...prev, categories: value ? [value] : [] }));
        else if (name === "search") setSearchText(value);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = recordData;
        createInventoryRecord(response);
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        //TO DO: add functionality that when a sortOption is selected, it holds for the search results

        try {
            const res = await search(searchText, filters);
            setResults(res);
        } catch (err) {
            console.error("Search failed", err);
        }
    };

    const handleSortSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const sortMap: Record<string, () => Promise<InventoryRecord[]>> = {
            "date-newest": () => sortByDate(results, false),
            "date-oldest": () => sortByDate(results, true),
            "quantity-least": () => sortByQuantity(results, true),
            "quantity-greatest": () => sortByQuantity(results, false),
        };

        // only call the function if a valid option is selected
        const sorting = sortMap[sortOption];
        if (!sorting) { 
            return;
        }

        const sortedResults = await sorting();
        setResults(sortedResults);
    };

    const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    return (  
        <div>
            <div>
                
                <h3>Filter Options:</h3>
                <form onSubmit={handleSearch}>
                    {/*filtering based on furniture type*/}
                    <label>Furniture type:</label>
                    <select name="category" value={filters.categories[0] || ""} onChange={handleFilterChange} style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}}>
                        <option value="">-- Select Furniture --</option>
                        <option value="couch">Couch</option>
                        <option value="bed">Bed</option>
                        <option value="table">Table</option>
                    </select>
                    <br/>
                    {/*filtering based on before/after date*/}
                    <label>Before Date:</label>
                    <input type="date" id="beforeDate" name="beforeDate" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}} onChange={handleFilterChange}/>
                    <label>After Date:</label>
                    <input type="date" id="afterDate" name="afterDate" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}} onChange={handleFilterChange}/>
                    <br/>
                    {/*filtering based on min/max stock*/}
                    <label> Minimum Stock</label>
                    <input type="text" id="minStock" name="minStock" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}} onChange={handleFilterChange}/>
                    <label> Maximum Stock </label>
                    <input type="text" id="maxStock" name="maxStock" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}} onChange={handleFilterChange}/>
                    <br/>
                    
                    {/*Submitting the filtering option*/}
                    <button type= "submit" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        Submit
                    </button>
                </form>
            </div>
            <div>
                <br/>
                <h4>Search bar </h4>
                <form onSubmit={handleSearch}>
                    <input  style={{ border: '1px solid black', borderCollapse: 'collapse', width: '30rem'}} 
                    type="text" id="search" name="search" placeholder="What do you want to search?"
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}/>
                    <button style={{ border: '1px solid black', borderCollapse: 'collapse' }}> 
                        Submit
                    </button>
                </form>
            </div>

            <div>
                <br/>
                <br/>
                <h4>Adding inventory</h4>
                <form onSubmit={handleSubmit}>
                    <input type="text" id="itemName" name="name" placeholder="Enter the name" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}
                        onChange={handleChange}
                        value={recordData.name}
                        />

                    <div>
                        <input type="text" id="thumbnailurl" name="thumbnailUrl" placeholder="Enter the thumbnail url" 
                            style={{ border: '1px solid black', borderCollapse: 'collapse' }}
                            onChange={handleChange}
                            value={recordData.thumbnail.url}/>

                        <input type="text" id="thumbnailalt" name="thumbnailAlt" placeholder="Enter the alt text" 
                            style={{ border: '1px solid black', borderCollapse: 'collapse' }}
                            onChange={handleChange}
                            value={recordData.thumbnail.altText}/>
                    </div>

                    {/*can't figure out how to do this in the form...*/}
                    <input type="text" id="otherPhoto" name="otherPhotos" placeholder="Enter other photos" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}/>

                    <input type="text" id="itemCategory" name="category" placeholder="Enter category" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}
                        onChange={handleChange}
                        value={recordData.category}/>

                    <input type="text" id="notes" name="notes" placeholder="Enter notes" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}
                        onChange={handleChange}
                        value={recordData.notes}/>

                    <input type="text"id="quantity" name="quantity" placeholder="Enter quantity" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}
                        onChange={handleChange}
                        value={recordData.quantity}/>


                    <button type= "submit" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        add
                    </button>
                </form>
            </div>

            <div>
                <form onSubmit={handleSortSubmit}>
                    <select name="sort" value={sortOption} onChange={handleSortSelect} style={{ 
                        border: '1px solid black',  borderCollapse: 'collapse', width: '12rem', }}>
                    <option value="">-- Sort Results By --</option>
                    <option value="date-newest">Date (Newest to Oldest)</option>
                    <option value="date-oldest">Date (Oldest to Newest)</option>
                    <option value="quantity-least">Quantity (Least to Greatest)</option>
                    <option value="quantity-greatest">Quantity (Greatest to Least)</option>
                    </select>           
                    <button type= "submit" style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        Submit
                    </button>
                </form>
            </div>
            <div>
                <br/>
                <br/>
                <table  style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Link to Photo</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Other Photos</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Category</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Notes</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Quantity</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Date Added</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length === 0 ? (
                        <tr><td colSpan={6}>No results found</td></tr>
                        ) : (
                        results.map(item => (
                            <tr key={item.id}>
                            <td>{item.name}</td>
                            <td><a href={item.thumbnail.url}>{item.thumbnail.altText}</a></td>
                            <td>
                                {item.otherPhotos.map(p => <div key={p.url}><a href={p.url}>{p.altText}</a></div>)}
                            </td>
                            <td>{item.category}</td>
                            <td>{item.notes}</td>
                            <td>{item.quantity}</td>
                            <td>{item.dateAdded.toDateString()}</td>  
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}