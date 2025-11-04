import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import { scheduleOnRN } from "react-native-worklets";

export default function VideoScreen() {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

    const videoOpacity = useSharedValue(0);

    const onVideoEnd = useCallback(
    () => {
        console.log("handleShouldPlayVideo");
        setShouldPlayVideo(false);
        setIsVideoLoaded(false);
    },
    [],
    );

    const handleVideoEnd = useCallback(
    () => {
        console.log("handleVideoEnd");
        videoOpacity.value = withDelay(
            2000,
            withTiming(
                0,
                {
                duration: 250,
                easing: Easing.out(Easing.ease),
                },
                (isFinished) => {
                if (isFinished) {
                    scheduleOnRN(onVideoEnd);
                }
                },
            ),
        );
    },
    [],
  );

    const videoAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: videoOpacity.value,
        };
    });

    useEffect(() => {
        if (isVideoLoaded) {
        setShouldPlayVideo(true);
        videoOpacity.value = withTiming(1, {
            duration: 250,
            easing: Easing.out(Easing.ease),
        });
        }
    }, [isVideoLoaded]);

    console.log(isVideoLoaded);

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Animated.View style={[StyleSheet.absoluteFillObject, videoAnimatedStyle]}>
                    <Video
                        source={require("@/assets/videos/video.mp4")}
                        onLoad={() => setIsVideoLoaded(true)}
                        onEnd={handleVideoEnd}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                        paused={!shouldPlayVideo}
                        muted
                    />
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D0D0D0',
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 16 / 9,
        marginHorizontal: 'auto',
    },
});
