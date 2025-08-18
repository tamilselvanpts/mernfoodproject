import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/home.css';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Annam FOOD!</h1>
          <p className="hero-description">
            Experience the freshest ingredients and delightful flavors in every dish. From our
            signature burgers to exquisite desserts, we promise a culinary journey that will
            tantalize your taste buds.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/menu")} className="btn btn-menu">
              View Our Menu
            </button>
            <button onClick={() => navigate("/table-booking")} className="btn btn-book">
              Book a Table
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>Annam FOOD</h2>
          <p>
            We are passionate about bringing authentic flavors and fresh ingredients straight to your
            table. Our chefs craft each dish with care to ensure a truly memorable dining experience.
          </p>
        </div>
        <div className="about-image">
          <img src="./restaurant.jpg" alt="Little Lemon Restaurant" />
        </div>
      </section>

      {/* Specials Section */}
      <section className="specials-section">
        <h2>Today's Specials</h2>
        <div className="specials-grid">
          <div className="special-card">
            <img src="./Grilled Salmon1.jpeg" alt="Special Dish 1" />
            <h3>Grilled Salmon</h3>
            <p>Perfectly seasoned salmon with fresh herbs and lemon butter sauce.</p>
          </div>
          <div className="special-card">
            <img src="./Signature Burger.jpg" alt="Special Dish 2" />
            <h3>Signature Burger</h3>
            <p>Juicy beef patty with cheese, lettuce, and our secret sauce.</p>
          </div>
          <div className="special-card">
            <img src="./Chocolate Lava Cake.jpeg" alt="Special Dish 3" />
            <h3>Chocolate Lava Cake</h3>
            <p>Rich chocolate cake with a molten center served with vanilla ice cream.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonial-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"The food was amazing! I loved the ambience and friendly staff."</p>
            <span>- Sarah J.</span>
          </div>
          <div className="testimonial">
            <p>"Best restaurant in town. The grilled salmon was to die for!"</p>
            <span>- Mark D.</span>
          </div>
          <div className="testimonial">
            <p>"We had a great evening. Highly recommend the desserts!"</p>
            <span>- Priya K.</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Experience Annam FOOD?</h2>
        <button onClick={() => navigate("/table-booking")} className="btn btn-book big-btn">
          Book Your Table Now
        </button>
      </section>
    </div>
  );
};

export default Homepage;
