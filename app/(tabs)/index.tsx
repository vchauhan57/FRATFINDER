import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { useDragging } from './DraggingContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatService from "../services/ChatService";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const IndexScreen = () => {
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const initialCards = [
        { id: 1, name: "Kendrick Lamar", bio: "The name is Kdot and I love to rap. When I start rapping I can't stop ending Drake's career. At the Super Bowl, I'm there.", image: require('../../assets/images/kendrick.jpg'), flippedImage: require('../../assets/images/kendrick2.jpg'), year: "Freshman", isFlipped: false, major: "Engineering", hobbies: ["hiking", "photography"] },
        { id: 2, name: "Stephen Curry", bio: "I own king james and the lakers. I am better than any laker all time", image: require('../../assets/images/steph.jpg'), flippedImage: require('../../assets/images/steph2.jpg'), year: "Sophomore", isFlipped: false, major: "Biology", hobbies: ["painting", "photography"] },
        { id: 3, name: "LeBron James", bio: "I'm boutta crash out on Anthony Davis if he sits out another game with a jammed finger. I'm tired of this shit I'm almost 40.", image: require('../../assets/images/lebron.jpg'), flippedImage: require('../../assets/images/lebron2.jpg'), year: "Junior", isFlipped: false, major: "Business", hobbies: ["basketball", "volunteering"] },
        { id: 4, name: "Abel Tesfaye", bio: "I have a bottom 5 voice of all time!!! FUCK YEAH!!!", image: require('../../assets/images/abel.png'), flippedImage: require('../../assets/images/abel2.jpg'), year: "Freshman", isFlipped: false, major: "Music Production", hobbies: ["music production", "fashion"] },
    ];

    const { setIsDragging, setSwipeDirection } = useDragging();
    const [cards, setCards] = useState(initialCards);
    const [cardIndex, setCardIndex] = useState(0);
    const animatedValues = useRef(initialCards.map(() => new Animated.Value(0))).current;
    const [flipAnimations] = useState(() => initialCards.map(() => new Animated.Value(0)));
    const swiperRef = useRef(null);
    const navigation = useNavigation();

    if (!fontsLoaded) {
        return null; // or a loading indicator
    }

    const onSwiped = (index) => {
        setCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
        resetAnimatedValue(index);
        setIsDragging(false);
        setSwipeDirection(null);

        const newCards = [...cards];
        newCards[index].isFlipped = false;
        setCards(newCards);
        flipAnimations[index].setValue(0);

        if (index + 1 < animatedValues.length) {
            animatedValues[index + 1].setValue(0);
        }
    };

    const onSwipedLeft = () => {
        if (swiperRef.current) {
            setSwipeDirection('left');
            setIsDragging(true);
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
            swiperRef.current.swipeRight();
            initiateChat(cards[cardIndex]);
            setTimeout(() => {
                setIsDragging(false);
                setSwipeDirection(null);
            }, 500);
        }
    };

    const initiateChat = (user) => {
        ChatService.startChatWithUser(user);
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
        setSwipeDirection(x > 0 ? 'right' : 'left');
    };

    const onSwipedAborted = (index) => {
        resetAnimatedValue(index);
        setIsDragging(false);
        setSwipeDirection(null);
    };

    const interpolateGlowColor = (x) => {
        return x.interpolate({
            inputRange: [-100, -50, 0, 50, 100],
            outputRange: ['red', 'red', 'transparent', 'green', 'green'],
            extrapolate: 'clamp',
        });
    };

    const interpolateGlowOpacity = (x) => {
        return x.interpolate({
            inputRange: [-100, -50, 0, 50, 100],
            outputRange: [1, 1, 0, 1, 1],
            extrapolate: 'clamp',
        });
    };

    const handleProfileTap = () => {
        const newCards = [...cards];
        newCards[cardIndex].isFlipped = !newCards[cardIndex].isFlipped;
        setCards(newCards);

        Animated.spring(flipAnimations[cardIndex], {
            toValue: newCards[cardIndex].isFlipped ? 1 : 0,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
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
                    const isTopCard = index === cardIndex;
                    const glowColor = isTopCard ? interpolateGlowColor(animatedValues[index]) : 'transparent';
                    const glowOpacity = isTopCard ? interpolateGlowOpacity(animatedValues[index]) : 0;
                    const frontAnimatedStyle = {
                        transform: [
                            {
                                rotateY: flipAnimations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '180deg'],
                                }),
                            },
                        ],
                    };

                    const backAnimatedStyle = {
                        transform: [
                            {
                                rotateY: flipAnimations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['180deg', '360deg'],
                                }),
                            },
                        ],
                        backgroundColor: '#ffffff',
                    };

                    return (
                        <Animated.View style={[styles.cardContainer, {
                            shadowColor: glowColor,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: glowOpacity,
                            shadowRadius: 10,
                            elevation: isTopCard ? 5 : 0,
                        }]}>
                            {/* Front Side */}
                            <Animated.View style={[styles.imageContainer, frontAnimatedStyle, {
                                backfaceVisibility: 'hidden',
                            }]}>
                                <Image style={styles.image} source={card.image} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,1.1)']}
                                    style={styles.gradientOverlay}
                                >
                                    <View style={styles.textContainer}>
                                    <Text style={[styles.name, { color: 'white' }]}>{card.name}</Text>
                                    <Text style={[styles.year, { color: 'white' }]}>{card.year}</Text>
                                    </View>
                                </LinearGradient>
                            </Animated.View>

                            {/* Back Side */}
                            <Animated.View style={[styles.imageContainer, backAnimatedStyle, {
                                backfaceVisibility: 'hidden',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                borderRadius: 20,
                            }]}>
                                <LinearGradient
                                    colors={['#705121', '#162238', '#162238', '#705121']}
                                    locations={[0, 0.15, 0.85, 1]}
                                    style={StyleSheet.absoluteFillObject}
                                />
                                <View style={styles.flippedImageContainer}>
                                    <Image source={card.flippedImage} style={styles.flippedImage} resizeMode="cover" />
                                </View>
                                <View style={styles.flippedTextContainer}>
                                    <View style={styles.nameContainer}>
                                        <Text style={styles.name}>{card.name}</Text>
                                        <Text style={styles.year}>{card.year}</Text>
                                    </View>
                                    <View style={styles.infoContainer}>
                                        <View style={styles.row}>
                                            <View style={styles.smallSection}>
                                                <Text style={styles.sectionHeader}>Hobbies</Text>
                                                <Text style={styles.textEntry}>{card.hobbies.join(', ')}</Text>
                                            </View>
                                            <View style={styles.smallSection}>
                                                <Text style={styles.sectionHeader}>Major</Text>
                                                <Text style={styles.textEntry}>{card.major}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.largeSection}>
                                            <Text style={styles.sectionHeader}>About</Text>
                                            <Text style={styles.textEntry}>{card.bio}</Text>
                                        </View>
                                    </View>
                                </View>
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
        backgroundColor: '#162238',
        paddingTop: 30,
    },
    logo: {
        position: 'absolute',
        top: 50,
        left: 20,
        fontSize: 30,
        fontWeight: 'bold',
        color: '#91760d',
        fontFamily: 'Montserrat_700Bold',
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
    flippedImageContainer: {
        width: '80%',
        height: '40%',
        marginTop: 20, // Increased from 10 to 20
        borderRadius: 20,
        overflow: 'hidden',
      },
    flippedImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        width: '100%',
        height: '40%',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'flex-end',
        padding: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    textContainer: {
        alignItems: 'flex-start',
        marginBottom: 60,
    },
    flippedTextContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    nameContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    infoContainer: {
        width: '100%',
        alignItems: 'stretch',
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    smallSection: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginHorizontal: 5,
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    largeSection: {
        width: '100%',
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D8C3A5',
        marginBottom: 5,
        textAlign: 'center', // Center text
    },
    textEntry: {
        fontSize: 14,
        color: '#E5C19E',
        lineHeight: 20,
        textAlign: 'center', // Center text
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E5C19E',
        fontFamily: 'Montserrat_700Bold',
    },
    year: {
        fontSize: 16,
        color: '#E5C19E',
        fontFamily: 'Montserrat_400Regular',
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