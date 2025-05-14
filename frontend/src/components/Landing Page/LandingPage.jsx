import React from 'react'
import './LandingPage.css'
import { Link } from 'react-router'

function LandingPage() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className='hero-section'>
                <nav className='navbar'>
                    <div className='container mx-auto flex justify-between items-center py-6 px-4 md:px-10'>
                        <h1 className="text-4xl font-bold text-red-700">TidyPlates</h1>
                        <div className="nav-buttons flex items-center gap-4">
                            <Link className='landing-button hover:bg-gray-100 active:bg-gray-300' to="/login">Login</Link>
                            <Link className='landing-button-primary' to="/signup">Sign Up</Link>
                        </div>
                    </div>
                </nav>
                
                <div className="hero-content container mx-auto px-4 md:px-10 pt-12 md:pt-24 pb-24 flex flex-col md:flex-row items-center">
                    <div className="hero-text md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800">
                            Meal Planning <span className="text-red-600">Made Simple</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Plan your meals, track your nutrition, and achieve your health goals with TidyPlates.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/signup" className="primary-button mr-4">Get Started Free</Link>
                            <a href="#features" className="secondary-button">Learn More</a>
                        </div>
                    </div>
                    <div className="hero-image md:w-1/2">
                        <img src="/Landing Page Assets/landing-page-top.png" alt="TidyPlates Hero" className="w-full h-auto"/>
                    </div>
                </div>
            </div>
            
            {/* Features Section */}
            <section id="features" className="features-section py-20">
                <div className="container mx-auto px-4">
                    <h2 className="section-title">Why Choose TidyPlates?</h2>
                    <p className="section-description">Your all-in-one solution for meal planning and nutrition tracking</p>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <img src="/Landing Page Assets/card-1.png" alt="Personalized Meal Plans" className="feature-icon" />
                            <h3 className="feature-title">Personalized Meal Plans</h3>
                            <p className="feature-description">Get custom meal plans based on your dietary preferences, restrictions, and health goals.</p>
                        </div>
                        
                        <div className="feature-card">
                            <img src="/Landing Page Assets/card-2.png" alt="Nutrition Tracking" className="feature-icon" />
                            <h3 className="feature-title">Nutrition Tracking</h3>
                            <p className="feature-description">Monitor your daily calorie intake, macros, and nutritional balance with our intuitive dashboard.</p>
                        </div>
                        
                        <div className="feature-card">
                            <img src="/Landing Page Assets/card-3.png" alt="Grocery Lists" className="feature-icon" />
                            <h3 className="feature-title">Smart Grocery Lists</h3>
                            <p className="feature-description">Automatically generate shopping lists based on your meal plans to save time and reduce waste.</p>
                        </div>
                        
                        <div className="feature-card">
                            <img src="/Landing Page Assets/card-4.png" alt="Recipe Collection" className="feature-icon" />
                            <h3 className="feature-title">Diverse Recipe Collection</h3>
                            <p className="feature-description">Access thousands of delicious recipes tailored to your dietary needs and preferences.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* How It Works Section */}
            <section className="how-it-works-section py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-description">Getting started with TidyPlates is as easy as 1-2-3</p>
                    
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Create Your Profile</h3>
                            <p className="step-description">Tell us about your dietary preferences, allergies, and health goals.</p>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3 className="step-title">Get Your Meal Plan</h3>
                            <p className="step-description">Receive a customized meal plan that fits your lifestyle and requirements.</p>
                        </div>
                        
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3 className="step-title">Track & Enjoy</h3>
                            <p className="step-description">Follow your plan, track your progress, and enjoy better health.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials */}
            <section className="testimonial-section py-20">
                <div className="container mx-auto px-4">
                    <h2 className="section-title">What Our Users Say</h2>
                    <p className="section-description">Join thousands of satisfied users on their health journey</p>
                    
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"TidyPlates has completely transformed my approach to meal planning. I've saved time, money, and I'm eating healthier than ever!"</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar"></div>
                                <div className="testimonial-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>Using TidyPlates for 6 months</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"As someone with multiple food allergies, finding an app that caters to my needs was a game-changer. TidyPlates is that app!"</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar"></div>
                                <div className="testimonial-info">
                                    <h4>Michael Chen</h4>
                                    <p>Using TidyPlates for 1 year</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"I've lost 15 pounds in 3 months by following the meal plans from TidyPlates. The nutrition tracking feature keeps me accountable."</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar"></div>
                                <div className="testimonial-info">
                                    <h4>Jessica Rivera</h4>
                                    <p>Using TidyPlates for 3 months</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Call to Action */}
            <section className="cta-section">
                <div className="container mx-auto px-4">
                    <div className="cta-content">
                        <h2>Start Your Health Journey Today</h2>
                        <p>Join TidyPlates and transform your meal planning experience.</p>
                        <Link to="/signup" className="cta-button">Sign Up Free</Link>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="site-footer">
                <div className="container mx-auto px-4 py-12">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h2 className="text-2xl font-bold text-red-700">TidyPlates</h2>
                            <p className="mt-4">Your personal assistant for healthy meal planning.</p>
                        </div>
                        
                        <div className="footer-links">
                            <h3>Quick Links</h3>
                            <ul>
                                <li><a href="#features">Features</a></li>
                                <li><Link to="/login">Login</Link></li>
                                <li><Link to="/signup">Sign Up</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer-links">
                            <h3>Resources</h3>
                            <ul>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Recipes</a></li>
                                <li><a href="#">Nutrition Guide</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-links">
                            <h3>Legal</h3>
                            <ul>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} TidyPlates. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage