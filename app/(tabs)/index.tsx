import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { useDragging } from './DraggingContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatService from "../services/ChatService"
import { 
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';

const IndexScreen = () => {
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold,
    });

    const initialCards = [
        { id: 1, name: "Kendrick Lamar", bio: "The name is Kdot and I love to rap. When I start rapping I can't stop ending Drake's career. At the Super Bowl, I'm there.", image: require('../../assets/images/kendrick.jpg'), flippedImage: require('../../assets/images/kendrick2.jpg'), year: "Freshman", isFlipped: false,         major: "Engineering",
            hobbies: ["hiking", "photography"] },
        { id: 2, name: "Stephen Curry", bio: "My team sucks, my team sucks, and my team sucks. The splash bros just became the splash brother, and I have to deal with Looney's ass for anoher year.", image: require('../../assets/images/steph.jpg'), flippedImage: require('../../assets/images/steph2.jpg'), year: "Sophomore", isFlipped: false,         major: "Biology",
            hobbies: ["painting", "photography"] },
        { id: 3, name: "LeBron James", bio: "I'm boutta crash out on Anthony Davis if he sits out another game with a jammed finger. I'm tired of this shit I'm almost 40.", image: require('../../assets/images/lebron.jpg'), flippedImage: require('../../assets/images/lebron2.jpg'), year: "Junior", isFlipped: false,         major: "Business",
            hobbies: ["basketball", "volunteering"] },
        { id: 4, name: "Abel Tesfaye", bio: "We had s*x in the studio, nobody's watching. Except my brother Kendrick, he's always watching cause he can never get sum.", image: require('../../assets/images/abel.png'), flippedImage: require('../../assets/images/abel2.jpg'), year: "Freshman", isFlipped: false,         major: "Music Production",
            hobbies: ["music production", "fashion"] },
    ];

    const { setIsDragging, setSwipeDirection } = useDragging();
    const [cards, setCards] = useState(initialCards);
    const [cardIndex, setCardIndex] = useState(0);
    const [isDraggingLocal, setIsDraggingLocal] = useState(false);
    const animatedValues = useRef(initialCards.map(() => new Animated.Value(0))).current;
    const [flipAnimations] = useState(() => 
        initialCards.map(() => new Animated.Value(0))
    );
    const swiperRef = useRef(null);
    const navigation = useNavigation();

    if (!fontsLoaded) {
        return null; // or a loading indicator
    }

    const onSwiped = (index) => {
        setCardIndex(prevIndex => (prevIndex + 1) % cards.length);
        resetAnimatedValue(index);
        setIsDraggingLocal(false);
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
        setIsDraggingLocal(true);
        setSwipeDirection(x > 0 ? 'right' : 'left');
    };

    const onSwipedAborted = (index) => {
        resetAnimatedValue(index);
        setIsDragging(false);
        setIsDraggingLocal(false);
        setSwipeDirection(null);
    };

    const interpolateGlowColor = (index) => {
        if (isDraggingLocal) {
            return animatedValues[index].interpolate({
                inputRange: [-Dimensions.get('window').width / 2, 0, Dimensions.get('window').width / 2],
                outputRange: ['red', '#fff', 'green'],
                extrapolate: 'clamp'
            });
        } else {
            return '#fff';  // Default color when not swiping
        }
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
        const glowColor = isDraggingLocal ? interpolateGlowColor(index) : '#fff'; // Apply glow color only when dragging
        const frontAnimatedStyle = {
            transform: [
                {
                    rotateY: flipAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg']
                    })
                }
            ]
        };

        const backAnimatedStyle = {
            transform: [
                {
                    rotateY: flipAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['180deg', '360deg']
                    })
                }
            ],
            backgroundColor: '#ffffff',
        };

        return (
            <Animated.View style={[styles.cardContainer, {
                shadowColor: glowColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isDraggingLocal ? 1 : 0,  // Adjust opacity based on dragging
                shadowRadius: 6,
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
                                    <View style={styles.textContainer}>
                                        <Text style={styles.name}>{card.name}</Text>
                                        <Text style={styles.year}>{card.year}</Text>
                                    </View>
                                </LinearGradient>
                            </Animated.View>
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
             colors={['#705121', '#162238', '#162238', '#705121']} // Lighter at the top, transitioning to a darker gold
             locations={[0, 0.15, 0.85, 1]} // Smooth transition with the darker gold at the bottom
        style={StyleSheet.absoluteFillObject}
    />
    <Image source={card.flippedImage} style={styles.flippedImage} resizeMode="contain" />
    <View style={styles.flippedTextContainer}>
        <Text style={styles.sectionHeader}>About</Text>
        <Text style={styles.textEntry}>{card.bio}</Text>
        <View style={styles.divider}></View>
        <Text style={styles.sectionHeader}>Major</Text>
        <Text style={styles.textEntry}>{card.major}</Text>
        <View style={styles.divider}></View>
        <Text style={styles.sectionHeader}>Hobbies</Text>
        <Text style={styles.textEntry}>{card.hobbies.join(', ')}</Text>
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
        paddingTop: 30
    },
    divider: {
        borderBottomColor: '#444',  // Subtle divider color
        borderBottomWidth: 1,       // Just a hairline
        marginVertical: 8,          // Space around the divider
    },
    textEntry: {
        fontSize: 16,
        color: '#E5C19E',         // Lighter text for bio
        lineHeight: 24,        // Increased line height for readability
        marginBottom: 10,      // Space between sections
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D8C3A5',         // White headers
        paddingVertical: 5,    // Space between header and text
        marginTop:-5,
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
    flippedImage: {
        width: '70%',  // Reducing the width to 80% of the container width
        height: '40%',   // Fixed height for all images
        alignSelf: 'center',  // Centering the image within its container
        marginTop: 20,  // Top margin to space it from the top of the card
        borderRadius: 70,  // Adjusting borderRadius to a sensible value for slight rounding
    },
    flippedTextContainer: {
        flex: 1,
        paddingHorizontal: 20,  // Horizontal padding
        paddingTop: 10,          // Space below the image
        paddingBottom: 20,       // Space above the buttons
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
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Montserrat_700Bold',
    },
    year: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Montserrat_400Regular',
    },
    bio: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginTop: 10,
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
