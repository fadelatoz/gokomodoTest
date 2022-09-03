import {useState,useEffect} from 'react'
import {Container,Button,Row,Col} from 'reactstrap'

// pagination component
function Pagination({ postPerPage, totalPost, currentPage, setCurrentPage, setLoading, paramCurrentPage, setParamCurrentPage, dataPerPage }) {
  const numberOfPages = [];

  for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i++) {
    numberOfPages.push(i);
  }

  const [arrOfCurrentButtons, setArrOfCurrentButtons] = useState([]);
  const [currentButton, setCurrentButton] = useState(1);

  useEffect(() => {
    const dotsInitial = '...';
    const dotsLeft = '...';
    const dotsRight = '...';

    let tmpNumberOfPages = [...arrOfCurrentButtons];

    if (currentPage !== undefined) {
      if (numberOfPages.length < 6) {
        tmpNumberOfPages = numberOfPages;
      } else if (currentPage >= 1 && currentPage <= 3) {
        tmpNumberOfPages = [1, 2, 3, dotsInitial, numberOfPages.length];
      } else if (currentPage === 4) {
        const sliced = numberOfPages.slice(0, 5);
        tmpNumberOfPages = [...sliced, dotsInitial, numberOfPages.length];
      } else if (currentPage > 4 && currentPage < numberOfPages.length - 2) {
        const sliced1 = numberOfPages.slice(currentPage - 2, currentPage);
        const sliced2 = numberOfPages.slice(currentPage, currentPage + 1);
        tmpNumberOfPages = [1, dotsLeft, ...sliced1, ...sliced2, dotsRight, numberOfPages.length];
      } else if (currentPage > numberOfPages.length - 3) {
        const sliced = numberOfPages.slice(numberOfPages.length - 4);
        tmpNumberOfPages = [1, dotsLeft, ...sliced];
      } else if (currentPage === dotsInitial) {
        setCurrentButton(arrOfCurrentButtons[arrOfCurrentButtons.length - 3] + 1);
      } else if (currentPage === dotsRight) {
        setCurrentButton(arrOfCurrentButtons[3] + 2);
      } else if (currentPage === dotsLeft) {
        setCurrentButton(arrOfCurrentButtons[3] - 2);
      }
    }

    setArrOfCurrentButtons(tmpNumberOfPages);
    setCurrentPage(currentPage);
  }, [totalPost, currentPage, dataPerPage]);

  const prev = () => {
    setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
    setParamCurrentPage((prevState) => (prevState === 0 ? prevState : prevState - postPerPage));
    setLoading(true);
  };

  const next = () => {
    setCurrentPage((prev) => (prev === numberOfPages.length ? prev : prev + 1));
    setParamCurrentPage((prevState) => (prevState === numberOfPages.length - 1 ? prevState : prevState + postPerPage));
    setLoading(true);
  };

  const clickPage = (page) => {
    setCurrentPage(page);
    setParamCurrentPage((page - 1) * postPerPage);
    setLoading(true);
  };



  return (
    <nav>
      <ul className="pagination">
        <button onClick={prev} disabled={currentPage === 1 || totalPost === 0} className="previous-btn">
          Sebelumnya
        </button>
        {arrOfCurrentButtons?.map((number) => (
          <li key={number} className={currentPage === number ? 'page-item-active' : 'page-item'}>
            {number === '...' ? (
              <a className="page-link">{number}</a>
            ) : (
              <a onClick={() => clickPage(number)} className="page-link">
                {number}
              </a>
            )}
            {/* <a onClick={() =>setCurrentButton(number)} className="page-link">
              {number}
            </a> */}
          </li>
        ))}
        <button onClick={next} disabled={currentPage === numberOfPages.length || totalPost === 0} className="previous-btn">
          Lanjut
        </button>
      </ul>
    </nav>
  );
}

function ListData(){
  const [listData,setListData] = useState()

  const [recordFilter, setRecordFilter] = useState();
  const [openDetail,setOpenDetail] = useState(false)
  const [dataDetail,setDataDetail] = useState()

  // pagination
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paramCurrentPage, setParamCurrentPage] = useState(0);
  const [dataPerPage, setDataPerpage] = useState(10);
  const [length, setLength] = useState();


  const indexLastData = currentPage * dataPerPage;
  const indexFirtsData = indexLastData - dataPerPage;
  const lastIndex = Math.ceil(length / dataPerPage);

  const numberOfPages = [];

  for (let i = 1; i <= Math.ceil(length / dataPerPage); i++) {
    numberOfPages.push(i);
  }

  useEffect (() => {
    fetch(`https://swapi.dev/api/people/?page=${currentPage}`)
    .then(response => response.json())
        // 4. Setting *dogImage* to the image url that we received from the response above
    .then(data => {
      setListData(data?.results)
      setLength(data?.count)
      setRecordFilter(data?.count)
    }
      
      )
    
  },[currentPage])


  return (
   <div className = 'container-list-data'>
    <div className='title-page'>
      <h3>List Data Test</h3>
    </div>
    <div className='table-list-data'>
      <table>
        <thead>
        <tr>
          <th>No</th>
          <th>name</th>
          <th>birth_year</th>
          <th>gender</th>
          <th>hair_color</th>
          <th>height</th>
          <th>homeworld</th>
          <th>mass</th>
          <th>skin_color</th>
          <th>url</th>       
          <th>Created At</th>
          <th>Eddited</th>
          <th>Action</th>  
        </tr>
        </thead>

        <tbody>
        {listData?.map((values,key) => (
          <tr>
            <td>{(currentPage - 1) * dataPerPage + (key + 1)}</td>
            <td>{values.name}</td>
            <td>{values.birth_year}</td>
            <td>{values.gender}</td>
            <td>{values.hair_color}</td>
            <td>{values.height}</td>
            <td>{values.homeworld}</td>
            <td>{values.mass}</td>
            <td>{values.skin_color}</td>
            <td>{values.url}</td>    
            <td>{values.created}</td>     
            <td>{values.edited}</td>      
            <td>
              <button 
                className='btn-action-detail'
                onClick={() => {
                  setOpenDetail(true)
                  setDataDetail(values)
                }}
                >
                Detail
              </button>
            </td>       
          </tr>
        ))}
      </tbody>
      </table>
    </div>

    {openDetail && 
      <div class="modal-content">
      <div class="modal-header">
        Data Detail
        <span onClick={() => setOpenDetail(false)} class="close">&times;</span>
        {/* <h2>Modal Header</h2> */}
      </div>
      <div class="modal-body">
        <p>Name : {dataDetail?.name}</p>
        <p>Birth Year : {dataDetail?.birth_year}</p>
        <p>Gender : {dataDetail?.gender}</p>
        <p>Hair Color: {dataDetail?.hair_color}</p>
        <p>Height: {dataDetail?.height}</p>
        <p>Home World : {dataDetail?.homeworld}</p>
        <p>Mass : {dataDetail?.mass}</p>
        <p>Skin Color : {dataDetail?.skin_colo}</p>
        <p>Url : {dataDetail?.name}</p>
        <p>Created : {dataDetail?.created}</p>
        <p>Edited : {dataDetail?.edited}</p>
      </div>
      <div class="modal-footer">
        {/* <h3>Modal Footer</h3> */}
      </div>
    </div>
    }

    <div className='pagination-list'>
      {
        <p className="pagination-desc">{`Menampilkan ${recordFilter === 0 ? recordFilter : indexFirtsData + 1} sampai ${
          indexLastData > recordFilter ? recordFilter : indexLastData
        } dari ${recordFilter}`}</p>
      }
      <Pagination
        currentPage={currentPage}
        paramCurrentPage={paramCurrentPage}
        // loading={loading}
        setLoading={setLoading}
        postPerPage={dataPerPage}
        totalPost={recordFilter}
        lastIndex={lastIndex}
        setCurrentPage={setCurrentPage}
        setParamCurrentPage={setParamCurrentPage}
        dataPerPage={dataPerPage}
      />
    </div>
   </div>
  )
}

export default ListData