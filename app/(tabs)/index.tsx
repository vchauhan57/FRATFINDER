import React, { useState, useEffect, useRef } from 'react'; // Import necessary hooks and components from React
import { View, StyleSheet, Text, Image, Dimensions, Animated, TouchableOpacity } from 'react-native'; // Import necessary components from React Native
import Swiper from 'react-native-deck-swiper'; // Import Swiper component
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient component
import { useDragging } from './DraggingContext'; // Import useDragging hook from DraggingContext
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from React Navigation
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import icons from MaterialCommunityIcons

const IndexScreen = () => {
    const initialCards = [ // Initial card data
        { id: 1, name: "Kendrick Lamar", bio: "Engineering Major at XYZ University. Enjoys hiking and outdoor activities.", image: require('../../assets/images/kendrick.jpg') },
        { id: 2, name: "Stephen Curry", bio: "Biology Major at XYZ University. Loves painting and photography.", image: require('../../assets/images/steph.jpg') },
        { id: 3, name: "LeBron James", bio: "You are my sunshine!", image: require('../../assets/images/lebron.jpg') },
        { id: 4, name: "Abel Tesfaye", bio: "We had s*x in the studio, nobody's watching", image: require('../../assets/images/abel.png') },
    ];

    const { setIsDragging, setSwipeDirection } = useDragging(); // Destructure setIsDragging and setSwipeDirection from useDragging hook
    const [cards, setCards] = useState(initialCards); // State for cards
    const [cardIndex, setCardIndex] = useState(0); // State for card index
    const [isDraggingLocal, setIsDraggingLocal] = useState(false); // Local state for dragging
    const [isFlipped, setIsFlipped] = useState(false); // State for flip animation
    const animatedValues = useRef(initialCards.map(() => new Animated.Value(0))).current; // Animated values for card animations
    const flipAnimation = useRef(new Animated.Value(0)).current; // Animated value for flip animation
    const swiperRef = useRef(null); // Ref for Swiper component
    const navigation = useNavigation(); // Navigation hook

    const onSwiped = (index) => {
        setCardIndex(prevIndex => (prevIndex + 1) % cards.length); // Update card index on swipe
        resetAnimatedValue(index); // Reset animated value on swipe
        setIsDraggingLocal(false); // Reset local dragging state
        setIsDragging(false); // Reset global dragging state
        setSwipeDirection(null); // Reset swipe direction
        setIsFlipped(false); // Reset flip state
        flipAnimation.setValue(0); // Reset flip animation
    };

    const onSwipedLeft = () => {
        if (swiperRef.current) {
            setSwipeDirection('left'); // Set swipe direction to left
            setIsDragging(true); // Set global dragging state to true
            setIsDraggingLocal(true); // Set local dragging state to true
            swiperRef.current.swipeLeft(); // Trigger swipe left
            setTimeout(() => {
                setIsDragging(false); // Reset global dragging state
                setSwipeDirection(null); // Reset swipe direction
            }, 500); // Timeout for 500ms
        }
    };

    const onSwipedRight = () => {
        if (swiperRef.current) {
            setSwipeDirection('right'); // Set swipe direction to right
            setIsDragging(true); // Set global dragging state to true
            setIsDraggingLocal(true); // Set local dragging state to true
            swiperRef.current.swipeRight(); // Trigger swipe right
            setTimeout(() => {
                setIsDragging(false); // Reset global dragging state
                setSwipeDirection(null); // Reset swipe direction
            }, 500); // Timeout for 500ms
        }
    };

    const resetAnimatedValue = (index) => {
        if (index < animatedValues.length) {
            Animated.timing(animatedValues[index], {
                toValue: 0, // Reset value to 0
                duration: 0, // Immediate reset
                useNativeDriver: false,
            }).start();
        }
    };

    const onSwiping = (index, x) => {
        animatedValues[index].setValue(x);
        setIsDragging(true); // Set global dragging state to true
        setIsDraggingLocal(true); // Set local dragging state to true
        setSwipeDirection(x > 0 ? 'right' : 'left'); // Set swipe direction
    };

    const onSwipedAborted = (index) => {
        resetAnimatedValue(index); // Reset animated value on swipe abort
        setIsDragging(false); // Reset global dragging state
        setIsDraggingLocal(false); // Reset local dragging state
        setSwipeDirection(null); // Reset swipe direction
    };

    const interpolateGlowColor = (index) => animatedValues[index].interpolate({
        inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2], // Input range for interpolation
        outputRange: ['red', '#fff', 'green'], // Output range for glow colors
        extrapolate: 'clamp' // Clamp the interpolation
    });

    const handleProfileTap = () => {
        setIsFlipped(!isFlipped); // Toggle flip state
        Animated.timing(flipAnimation, {
            toValue: isFlipped ? 0 : 1, // Animate flip based on current state
            duration: 500, // Duration of flip animation
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    };

    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1], // Input range for flip animation
                    outputRange: ['0deg', '180deg'] // Output range for front side
                })
            }
        ]
    };

    const backAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1], // Input range for flip animation
                    outputRange: ['180deg', '360deg'] // Output range for back side
                })
            }
        ]
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>fratch.</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity>
                    <MaterialCommunityIcons name="filter" size={24} color="#808080" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.icon}>
                    <MaterialCommunityIcons name="cog" size={24} color="#91760d" />
                </TouchableOpacity>
            </View>
            <Swiper
                ref={swiperRef}
                cards={cards}
                renderCard={(card, index) => {
                    const glowColor = interpolateGlowColor(index);
                    return (
                        <View style={styles.cardContainer}>
                            <Animated.View style={[styles.imageContainer, frontAnimatedStyle, isDraggingLocal && {
                                shadowColor: glowColor,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 1.5,
                                shadowRadius: 9,
                                elevation: 5,
                            }, {
                                backfaceVisibility: 'hidden'
                            }]}>
                                <Image style={styles.image} source={card.image} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1.1)']}
                                    style={styles.gradientOverlay}
                                >
                                    <Text style={styles.name}>{card.name}</Text>
                                </LinearGradient>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={onSwipedLeft} style={styles.actionButton}>
                                        <MaterialCommunityIcons name="close" size={25} color="#808080" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleProfileTap} style={styles.actionButton}>
                                        <MaterialCommunityIcons name="account" size={25} color="#91760d" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onSwipedRight} style={styles.actionButton}>
                                        <MaterialCommunityIcons name="check" size={25} color="#808080" />
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                            <Animated.View style={[styles.imageContainer, backAnimatedStyle, {
                                backfaceVisibility: 'hidden',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#808080',
                                borderRadius: 40,
                                padding: 10,
                                marginTop: -50
                            },]}>
                                <Text style={styles.name}>{card.name}</Text>
                                <Text style={styles.bio}>{card.bio}</Text>
                            </Animated.View>
                        </View>
                    );
                }}
                onSwiped={onSwiped}
                onSwiping={(x) => onSwiping(cardIndex, x)}
                onSwipedAborted={() => onSwipedAborted(cardIndex)}
                cardIndex={cardIndex}
                infinite
                backgroundColor={'transparent'}
                stackSize={4}
                stackSeparation={0}
                disableBottomSwipe
                disableTopSwipe
                containerStyle={{ marginTop: 50 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingTop: 30
    },
    logo: {
        position: 'absolute',
        top: 50,
        left: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#91760d'
    },
    iconContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 15,
    },
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').height - 200,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        overflow: 'visible',
        padding: 10,
        marginTop: -50,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
    },
    gradientOverlay: {
        width: '100%',
        height: '30%',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    bio: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: -25,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    actionButton: {
        backgroundColor: '#000',
        borderRadius: 15,
        padding: 5,
        marginHorizontal: 20,
    },
});

export default IndexScreen;
