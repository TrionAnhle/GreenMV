import "./Footer.css"

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="footer-col">
                        <h4>Theo dõi</h4>
                        <div className="social-links">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Hỗ trợ</h4>
                        <ul>
                            <li><a href="#">Phim</a></ li>
                            <li><a href="/movie/session">Suất chiếu</a></ li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Liên hệ</h4>
                        <ul>
                            <li><a href="#">0985145125</a></li>
                            <li><a href="#">tuananh101lk@gmail.com</a></li>
                            <li><a href="#">60 Vạn Kiếp, phường 7, quận Phú Nhuận, Hồ chí minh</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
