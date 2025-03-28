import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { profilePhoto } from "../utils/imageUtils";
import "./css/profileHeader.css";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import announcementLogo from "/img/l2.png";
import connectLogo from "/img/l3.jpeg";
import learnLogo from "/img/l5.png";
import utilityLogo from "/img/l8.png";
import wellBeingLogo from "/img/l9.png";

const ProfileHeader = ({ onNavChange }) => {
    const navigate = useNavigate();
    const { getUserDetail } = useUser();

    const [profileData, setProfileData] = useState({
        fullName: "",
        image: "",
        description: "",
    });

    const [activeNav, setActiveNav] = useState(0);
    const navRefs = useRef([]);
    const sliderRef = useRef(null);

    const navItems = [
        {
            icon: (
                <img
                    src={connectLogo}
                    style={{ height: "50px", borderRadius: "50%" }}
                />
            ),
            label: "Let's Connect!",
            content: "0",
        },
        {
            icon: (
                <img
                    src={wellBeingLogo}
                    style={{ height: "50px", borderRadius: "50%" }}
                />
            ),
            label: "Wellbeing Matters!",
            content: "1",
        },

        {
            icon: (
                <img
                    src={learnLogo}
                    style={{ height: "50px", borderRadius: "50%" }}
                />
            ),
            label: "Study, Learn and Earn!",
            content: "2",
        },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserDetail();
                setProfileData({
                    fullName: response.data[0].full_name || "",
                    image: response.data[0].user_picture || "",
                    description: response.data[0].description || "",
                });
            } catch (err) {
                console.error("Failed to fetch profile data.", err);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        const adjustSlider = () => {
            if (navRefs.current[activeNav]) {
                const navItem = navRefs.current[activeNav];
                sliderRef.current.style.width = `${navItem.offsetWidth}px`;
                sliderRef.current.style.left = `${navItem.offsetLeft}px`;
            }
        };

        // Add delay using setTimeout to allow for DOM rendering to complete
        setTimeout(adjustSlider, 100);

        // Listen for window resize events and recalculate the position
        window.addEventListener("resize", adjustSlider);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener("resize", adjustSlider);
        };
    }, [activeNav]);

    const handleNavClick = (index) => {
        setActiveNav(index);
        onNavChange(navItems[index].content);
    };

    return (
        <div className="profile-header">
            <div className="profile-header-content">
                <div className="profile-card">
                    <div className="profile-info">
                        <div className="profile-image-container">
                            <img
                                src={profileData.image || profilePhoto}
                                alt={profileData.fullName}
                                className="profile-image"
                            />
                        </div>
                        <div>
                            <h2 className="profile-name">
                                {profileData.fullName}
                            </h2>
                            <p className="profile-role">
                                {profileData.description}
                            </p>
                        </div>
                    </div>

                    <Button
                        type="text"
                        className="member-button"
                        onClick={() => {
                            navigate("profile");
                        }}
                    >
                        View Profile{" "}
                        <ArrowRightOutlined className="arrow-icon" />
                    </Button>
                </div>

                {/* Navigation Section */}
                <div className="navigation-section">
                    {navItems.map((item, index) => (
                        <Button
                            key={index}
                            type="text"
                            ref={(el) => (navRefs.current[index] = el)}
                            className={`nav-link ${
                                activeNav === index ? "active" : ""
                            }`}
                            onClick={() => handleNavClick(index)}
                        >
                            {item.icon} {item.label}
                        </Button>
                    ))}
                    <div className="slider" ref={sliderRef} />
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
