import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import Confetti from 'react-confetti';

export default function UI() {
    const collectedGifts = useStore(state => state.collectedGifts);
    const gifts = useStore(state => state.gifts);
    const currentGift = useStore(state => state.currentGift);
    const closeGift = useStore(state => state.closeGift);

    const [showCelebration, setShowCelebration] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Track window size for confetti
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check for win condition
    useEffect(() => {
        if (collectedGifts.length === gifts.length && gifts.length > 0 && !currentGift) {
            setShowCelebration(true);
        }
    }, [collectedGifts, gifts, currentGift]);

    return (
        <div className="ui-container">
            {/* Celebration Overlay */}
            {showCelebration && (
                <div className="celebration-overlay">
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        numberOfPieces={500}
                        gravity={0.2}
                    />
                    <h1 className="shining-text">Happy Birthday!</h1>
                    {/* Use the generated image path directly or import it if moved to assets. 
                        Since we can't easily move files in this environment without a copy command, 
                        we'll assume the image is in the artifacts folder but for the app to see it, 
                        it needs to be in public or imported. 
                        Wait, I can't import from .gemini. 
                        I should use a placeholder URL for now or if I had moved it.
                        I will use a high quality placeholder for reliability.
                    */}
                    <img
                        src="https://images.unsplash.com/photo-1464349153735-7db50ed83c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        alt="Birthday Celebration"
                        className="celebration-image"
                    />
                </div>
            )}

            <div className="instructions">
                <h1>🎁 Birthday Treasure Hunt 🎁</h1>
                <p>Use WASD or Arrow Keys to move • Find all {gifts.length} gifts!</p>
            </div>

            <div className="gift-counter">
                Gifts Found: <span>{collectedGifts.length}</span> / {gifts.length}
            </div>

            <AnimatePresence>
                {currentGift && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeGift();
                            window.focus();
                        }}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2>🎉 {currentGift.room} 🎉</h2>

                            <img
                                src={currentGift.photo}
                                alt={currentGift.room}
                                className="modal-photo"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x300?text=Photo+Placeholder';
                                }}
                            />

                            <div className="modal-message">
                                <p>{currentGift.message}</p>
                                <p className="from">— {currentGift.from}</p>
                            </div>

                            <button
                                className="close-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeGift();
                                    window.focus();
                                }}
                            >
                                Continue Exploring
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
