import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { useDragging } from './DraggingContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const IndexScreen = () => {
    const initialCards = [
        { id: 1, name: "Kendrick Lamar", bio: "Engineering Major at XYZ University. Enjoys hiking and outdoor activities.", image: require('../../assets/images/kendrick.jpg'), year: "Freshman" },
        { id: 2, name: "Stephen Curry", bio: "Biology Major at XYZ University. Loves painting and photography.", image: require('../../assets/images/steph.jpg'), year: "Sophomore" },
        { id: 3, name: "LeBron James", bio: "You are my sunshine!", image: require('../../assets/images/lebron.jpg'), year: "Junior" },
        { id: 4, name: "Abel Tesfaye", bio: "We had s*x in the studio, nobody's watching", image: require('../../assets/images/abel.png'), year: "Freshman" },
    ];

    const { setIsDragging, setSwipeDirection } = useDragging();
    const [cards, setCards] = useState(initialCards);
    const [cardIndex, setCardIndex] = useState(0);
    const [isDraggingLocal, setIsDraggingLocal] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const animatedValues = useRef(initialCards.map(() => new Animated.Value(0))).current;
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const swiperRef = useRef(null);
    const navigation = useNavigation();

    const onSwiped = (index) => {
        setCardIndex(prevIndex => (prevIndex + 1) % cards.length);
        resetAnimatedValue(index);
        setIsDraggingLocal(false);
        setIsDragging(false);
        setSwipeDirection(null);
        setIsFlipped(false);
        flipAnimation.setValue(0);
        
        if (index + 1 < animatedValues.length) {
            animatedValues[index + 1].setValue(0);
        }
    };

    const onSwipedLeft = () => {
        if (swiperRef.current) {
            setSwipeDirection('left');
            setIsDragging(true);
            setIsDraggingLocal(true);
            swiperRef.current.swipeLeft();
            setTimeout(() => {
                setIsDragging(false);
                setSwipeDirection(null);
            }, 500);
        }
    };

    const onSwipedRight = () => {
        if (swiperRef.current) {
            setSwipeDirection('right');
            setIsDragging(true);
            setIsDraggingLocal(true);
            swiperRef.current.swipeRight();
            setTimeout(() => {
                setIsDragging(false);
                setSwipeDirection(null);
            }, 500);
        }
    };

    const resetAnimatedValue = (index) => {
        if (index < animatedValues.length) {
            Animated.timing(animatedValues[index], {
                toValue: 0,
                duration: 0,
                useNativeDriver: false,
            }).start();
        }
    };

    const onSwiping = (index, x) => {
        animatedValues[index].setValue(x);
        setIsDragging(true);
        setIsDraggingLocal(true);
        setSwipeDirection(x > 0 ? 'right' : 'left');
    };

    const onSwipedAborted = (index) => {
        resetAnimatedValue(index);
        setIsDragging(false);
        setIsDraggingLocal(false);
        setSwipeDirection(null);
    };

    const interpolateGlowColor = (index) => animatedValues[index].interpolate({
        inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
        outputRange: ['red', '#fff', 'green'],
        extrapolate: 'clamp'
    });

    const handleProfileTap = () => {
        setIsFlipped(!isFlipped);
        Animated.spring(flipAnimation, {
            toValue: isFlipped ? 0 : 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    };

    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                })
            }
        ]
    };

    const backAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '360deg']
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
                        <Animated.View style={[styles.cardContainer, {
                            shadowColor: glowColor,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 1,
                            shadowRadius: 10,
                            elevation: 5,
                        }]}>
                            <Animated.View style={[styles.imageContainer, frontAnimatedStyle, {
                                backfaceVisibility: 'hidden',
                            }]}>
                                <Image style={styles.image} source={card.image} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1.1)']}
                                    style={styles.gradientOverlay}
                                >
                                    <Text style={styles.name}>{card.name + ", " + card.year}</Text>
                                </LinearGradient>
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
                                backgroundColor: '#f0f0f0',
                                borderRadius: 40,
                                padding: 20,
                            }]}>
                                <Text style={[styles.name, {color: '#333'}]}>{card.name}</Text>
                                <Text style={styles.bio}>{card.bio}</Text>
                            </Animated.View>
                        </Animated.View>
                    );
                }}
                onSwiped={onSwiped}
                onSwiping={(x, y) => onSwiping(cardIndex, x)}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e3d5ca',
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
        marginRight: 'auto',
        borderRadius: 40,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        overflow: 'hidden',
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
        color: '#333',
        textAlign: 'center',
        marginTop: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    actionButton: {
        backgroundColor: '#000',
        borderRadius: 30,
        padding: 15,
        marginHorizontal: 20,
    },
});

export default IndexScreen;
