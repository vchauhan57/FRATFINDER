import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { useDragging } from './DraggingContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const IndexScreen = () => {
    const initialCards = [
        { id: 1, name: "Kendrick Lamar", bio: "Engineering Major at XYZ University. Enjoys hiking and outdoor activities.", image: require('../../assets/images/kendrick.jpg') },
        { id: 2, name: "Stephen Curry", bio: "Biology Major at XYZ University. Loves painting and photography.", image: require('../../assets/images/steph.jpg') },
        { id: 3, name: "LeBron James", bio: "You are my sunshine!", image: require('../../assets/images/lebron.jpg') },
        { id: 4, name: "Abel Tesfaye", bio: "We had s*x in the studio, nobody's watching", image: require('../../assets/images/abel.png') },
    ];

    const { setIsDragging, setSwipeDirection } = useDragging();
    const [cards, setCards] = useState(initialCards);
    const [cardIndex, setCardIndex] = useState(0);
    const animatedValues = useRef(initialCards.map(() => new Animated.Value(0))).current;
    const swiperRef = useRef(null); // Create a reference to the Swiper component
    const navigation = useNavigation();

    useEffect(() => {
        if (cards.length !== animatedValues.length) {
            animatedValues.current = cards.map(() => new Animated.Value(0));
        }

        if (cardIndex >= cards.length) {
            setCardIndex(0);
        }
    }, [cardIndex, cards.length]);

    const onSwiped = (index) => {
        setCardIndex(prevIndex => (prevIndex + 1) % cards.length);
        resetAnimatedValue(index);
        setIsDragging(false);
        setSwipeDirection(null);
    };

    const onSwipedLeft = () => {
        if (swiperRef.current) {
            setSwipeDirection('left');
            setIsDragging(true);
            swiperRef.current.swipeLeft();
            setTimeout(() => {
                setIsDragging(false);
                setSwipeDirection(null);
            }, 500); // Adjust this value if needed
        }
    };

    const onSwipedRight = () => {
        if (swiperRef.current) {
            setSwipeDirection('right');
            setIsDragging(true);
            swiperRef.current.swipeRight();
            setTimeout(() => {
                setIsDragging(false);
                setSwipeDirection(null);
            }, 500); // Adjust this value if needed
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
        if (Math.abs(x) > 1) {
            if (index < animatedValues.length) {
                animatedValues[index].setValue(x);
            }
            setIsDragging(true);
            setSwipeDirection(x > 0 ? 'right' : 'left');
        } else {
            setIsDragging(false);
            setSwipeDirection(null);
        }
    };

    const onSwipedAborted = (index) => {
        resetAnimatedValue(index);
        setIsDragging(false);
        setSwipeDirection(null);
    };

    const interpolateGlowColor = (index) => animatedValues[index].interpolate({
        inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
        outputRange: ['red', '#fff', 'green'],
        extrapolate: 'clamp'
    });

    const handleProfileTap = (profile) => {
        navigation.navigate('ProfileDetail', { profile });
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
                ref={swiperRef} // Attach the reference to the Swiper component
                cards={cards}
                renderCard={(card, index) => {
                    const glowColor = interpolateGlowColor(index);

                    return (
                        <View style={styles.cardContainer}>
                            <Animated.View style={[styles.imageContainer, {
                                shadowColor: glowColor,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 1.5,
                                shadowRadius: 9,
                                elevation: 5
                            }]}>
                                <Image style={styles.image} source={card.image} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1.1)']}
                                    style={styles.gradientOverlay}
                                >
                                    <Text style={styles.name}>{card.name}</Text>
                                    <Text style={styles.bio}>{card.bio}</Text>
                                </LinearGradient>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={onSwipedLeft} style={styles.actionButton}>
                                        <MaterialCommunityIcons name="close" size={25} color="#808080" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleProfileTap(card)} style={styles.actionButton}>
                                        <MaterialCommunityIcons name="account" size={25} color="#91760d" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onSwipedRight} style={styles.actionButton}>
                                        <MaterialCommunityIcons name="check" size={25} color="#808080" />
                                    </TouchableOpacity>
                                </View>
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
                stackSize={3}
                stackSeparation={15}
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
        backgroundColor: '#050505',
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
        bottom: -25, // Adjust this value to position the buttons correctly
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
    },
    actionButton: {
        backgroundColor: '#000',
        borderRadius: 15,
        padding: 5,
    }
});

export default IndexScreen;
