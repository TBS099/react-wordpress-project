import React from "react";
import './Pagination.css';

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            currentPage : 1
        }
    }

    render() {
        const { postsPerPage, totalPosts, paginate } = this.props;
        const { currentPage } = this.state;

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
          pageNumbers.push(i);
        }
    
        const handlePageClick = (pageNumber) => {
          this.setState({ currentPage: pageNumber });
          paginate(pageNumber);
          console.log(pageNumber);
        };

        console.log(Math.ceil(totalPosts / postsPerPage));
        console.log(totalPosts);
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