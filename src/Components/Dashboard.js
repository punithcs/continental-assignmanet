import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTable, usePagination,useSortBy } from "react-table";

function Dashboard() {

  const Activecolumns = React.useMemo(
    () => [
      {
        Header: "Info",
        columns: [
          {
            Header: "Purchased Date",
            accessor: "Purchased Date",
          },
          {
            Header: "Price",
            accessor: "Price",
          },
          {
            Header: "Quantity",
            accessor: "Quantity",
          },
          {
            Header: "Requeset Raised by",
            accessor: "Requeset Raised by",
          },
          {
            Header: "Requeset Raised on",
            accessor: "Requeset Raised on",
          },
          {
            Header: "Description",
            accessor: "Description",
          },
        ],
      },
    ],
    []
  );
  const [myArray, setmyArray] = useState([]);
  const [originalData, setoriginalData] = useState([]);
  const [error, seterror] = useState();

  useEffect(() => {
    axios
      .get("constants.json")
      .then((res) => {
        setmyArray(res.data);
        setoriginalData(res.data);
      })
      .catch();
      //console.log(originalData.sort('Requeset Raised by')); 
  }, []);
 

  const search = (e) => {
    e.preventDefault();
    const valOuter = e.target.value;
    if (valOuter === "") {
        setmyArray(originalData);
        seterror("");
    } else {
      var val = valOuter.toLowerCase();
      let filterList = originalData.filter((item) => {
        return (
          (item["Price"].toLowerCase().indexOf(val) !== -1) |
          (item.Quantity.toLowerCase().indexOf(val) !== -1) |
          (item["Requeset Raised on"].toLowerCase().indexOf(val) !== -1) |
          (item.Description.toLowerCase().indexOf(val) !== -1) | 
          (item["Requeset Raised by"].toLowerCase().indexOf(val) !== -1) | 
          (item["Purchased Date"].toLowerCase().indexOf(val) !== -1)
        );
      });
      console.log(filterList);
      if(filterList.length === 0){
        seterror("No data Found");
        console.log("dskbvdk")
        setmyArray([]);
      } else{
        setmyArray(filterList);
        seterror("");
      }
    }
  };
 

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 colo-md-12 col-sm-12">
          <div className="table-wrapper">
          <Table columns={Activecolumns} data={myArray} search={search} error={error}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function Table({ columns, data, search, error }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination,
  );
  return (
    <div>
      <div className="input">
        <input onChange={(e) => search(e)} placeholder="Search..." />
      </div>
      <table {...getTableProps()} className="react-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  let td = "";
                  cell.column.Header === "Price"
                    ? (td = (
                        <td
                          className="tbTableVal popup-td"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))
                    : (td = (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ));
                  return td;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
        <div className="error">{error}</div>
      <div className="pagination">
      <div className="show-numbers">
        <p>Show</p>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[1, 2, 3, 4, 10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
               {pageSize}
            </option>
          ))}
        </select>
        </div>
        <div className="previous-btn">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        </div>
        <div className="infor">
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        </div>
        <div className="next-btn">
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
