import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, Animated } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { LinearGradient } from 'expo-linear-gradient';

const IndexScreen = () => {
    const initialCards = [
        { id: 1, name: "Kendrick Lamar", bio: "Engineering Major at XYZ University. Enjoys hiking and outdoor activities.", image: require('../../assets/images/kendrick.jpg') },
        { id: 2, name: "Stephen Curry", bio: "Biology Major at XYZ University. Loves painting and photography.", image: require('../../assets/images/steph.jpeg') },
        { id: 3, name: "LeBron James", bio: "You are my sunshine!", image: require('../../assets/images/lebron.jpeg')},
        { id: 4, name: "Abel Tesfaye", bio: "We had s*x in the studio, nobody's watching", image: require('../../assets/images/abeltesfaye.jpeg')},
    ];

    const [cards, setCards] = useState(initialCards);
    const [cardIndex, setCardIndex] = useState(0);
    const animatedValues = useRef(initialCards.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        if (cards.length !== animatedValues.length) {
            animatedValues.current = cards.map(() => new Animated.Value(0));
        }

        if (cardIndex >= cards.length) {
            setCardIndex(0);
        }
    }, [cardIndex, cards.length]);

    const onSwiped = () => {
        setCardIndex(prevIndex => (prevIndex + 1) % cards.length);
    };

    const onSwiping = (index, x) => {
        if (index < animatedValues.length) {
            animatedValues[index].setValue(x);
        }
    };

    const onSwipedAborted = (index) => {
        if (index < animatedValues.length) {
            Animated.timing(animatedValues[index], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>fratch.</Text>
            <Swiper
                cards={cards}
                renderCard={(card, index) => {
                    const borderColor = animatedValues[index].interpolate({
                        inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
                        outputRange: ['#ff0000', '#fff', '#00ff00'],
                        extrapolate: 'clamp'
                    });

                    const shadowColor = animatedValues[index].interpolate({
                        inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
                        outputRange: ['rgba(255,0,0,0.5)', 'transparent', 'rgba(0,255,0,0.5)'],
                        extrapolate: 'clamp'
                    });

                    return (
                        <View style={styles.cardContainer}>
                            <Animated.View style={[styles.imageContainer, { borderColor, shadowColor, shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 0 } }]}>
                                <Image style={styles.image} source={card.image} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1.1)']}
                                    style={styles.gradientOverlay}
                                >
                                    <Text style={styles.name}>{card.name}</Text>
                                    <Text style={styles.bio}>{card.bio}</Text>
                                </LinearGradient>
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
        borderWidth: 3,
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
    }
});

export default IndexScreen;
