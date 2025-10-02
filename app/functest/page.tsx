import {InventoryRecord, InventoryRecordData, SearchFilters} from "@/types/inventory";
import {search, createInventoryRecord, getInventoryRecord, updateInventoryRecord, deleteInventoryRecord} from "@/lib/services/inventory";

export default function FuncTestPage() {
    return (  
        <div>
            <div>
                
                <h3>Filter Options:</h3>
                <form>
                    {/*filtering based on furniture type*/}
                    <label>Furniture type:</label>
                    <select id="furnitureType" name="furnitureType" style={{ border: '1px solid black', 
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
                        borderCollapse: 'collapse', width: '10rem'}}/>
                    <label>After Date:</label>
                    <input type="date" id="afterDate" name="afterDate" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}}/>
                    <br/>
                    {/*filtering based on min/max stock*/}
                    <label> Minimum Stock</label>
                    <input type="text" id="minStock" name="minStock" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}} />
                    <label> Maximum Stock </label>
                    <input type="text" id="maxStock" name="maxStock" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}}/>
                    <br/>
                    {/*filtering based on category */}
                    <label>Choose a category:</label>
                    <select id="category" name="category" style={{ border: '1px solid black', 
                        borderCollapse: 'collapse', width: '10rem'}}>
                        <option value="chairs">Chairs</option>
                        <option value="tables">Tables</option>
                        <option value="couches">Couches</option>
                    </select>
                
                    {/*Submitting the filtering option*/}
                    <button>
                        Submit
                    </button>
                </form>
            </div>
            <div>
                <br/>
                <h4>Search bar </h4>
                <form>
                    <input  style={{ border: '1px solid black', borderCollapse: 'collapse', width: '30rem'}} 
                    type="text" id="search" name="search" placeholder="What do you want to search?"/>
                    <button style={{ border: '1px solid black', borderCollapse: 'collapse' }}> 
                        Submit
                    </button>
                </form>
            </div>

            <div>
                <br/>
                <br/>
                <h4>Adding inventory</h4>
                <form>
                    <input type="text" id="itemName" name="itemName" placeholder="Enter the name" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}/>

                    <input type="text" id="thumbnail" name="thumbnail" placeholder="Enter the thumbnail" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}/>

                    <input type="text" id="otherPhoto" name="otherPhoto" placeholder="Enter other photos" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}/>

                    <input type="text" id="itemCategory" name="itemCategory" placeholder="Enter category" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}/>

                    <input type="text" id="notes" name="notes" placeholder="Enter notes" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}/>

                    <input type="text"id="quantity" name="quantity" placeholder="Enter quantity" 
                        style={{ border: '1px solid black', borderCollapse: 'collapse' }}/>

                    <button style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        add
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
                        <tr style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                            <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}></td>
                            <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}></td>
                            <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}></td>
                            <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}></td>
                            <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}></td>
                            <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}></td>
                            <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}></td>
                            <td>
                                <button style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                                    delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
}