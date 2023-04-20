import React from "react";
import './Pagination.css';

//Creates Pagination Class Component
class Pagination extends React.Component {
    constructor(props) {
        super(props);
        
        //Declaring state
        this.state = {
            currentPage : 1
        }
    }

    render() {
        const { postsPerPage, totalPosts, paginate } = this.props;
        const { currentPage } = this.state;

        const pageNumbers = [];

        //Displays page numbers according to total posts and posts per page
        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
          pageNumbers.push(i);
        }
    
        //Function to be called when pagination number button is clicked
        const handlePageClick = (pageNumber) => {
          this.setState({ currentPage: pageNumber });
          paginate(pageNumber);
        };

        //Displays HTML
        return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map((pageNumber) => (
            <li key={pageNumber} className="page-item">
              <a
                onClick={() => handlePageClick(pageNumber)}
                href="#!"
                className={`page-link ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
    }
}
export default Pagination;