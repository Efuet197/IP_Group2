import { Colors } from '@/constants/Colors';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const icon:any={
    home:(props:any)=><Feather name='home' size={24} {...props} />,
    // mechanic:(props:any)=><IconSymbol size={24} name="car.badge.gearshape" {...props}  />, 
    mechanic:(props:any)=><MaterialIcons name="engineering" size={24} {...props} />, 
    // mechanic:(props:any)=><MaterialCommunityIcons name="car-cog" color="#000" size={24} {...props} />,
    profile:(props:any)=><Feather name='user' size={24} {...props}  />,
}

const TabBarButton=({onPress,onLongPress,isFocused,routeName,color,label,options,heightF,widthF}:{
    onPress:((e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => void)
    onLongPress:((event: GestureResponderEvent) => void);
    isFocused:boolean
    routeName:string;
    heightF:number;
    widthF:number;
    color:string;
    label:string
    options:BottomTabNavigationOptions
})=>{
    const { colors } = useTheme();
    const scale=useSharedValue(0)
    useEffect(()=>{
        scale.value=withSpring(typeof isFocused==='boolean'?(isFocused?1:0):isFocused,{duration:350})
    },[scale,isFocused])

    const animatedTextStyle=useAnimatedStyle(()=>{
        const opacity = interpolate(scale.value,[0,1],[1,0])
        return {
            opacity
        }
    })
    const animatedIconStyle=useAnimatedStyle(()=>{
        const scaleValue = interpolate(scale.value,[0,1],[1,1.2])
        const top=interpolate(scale.value,[0,1],[0,9])
        return {
            transform:[{
                scale:scaleValue
            }],
            top
        }
    })
    return (
          <PlatformPressable
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            // style={[styles.tabBarItem]}
            style={[styles.tabBarItem,isFocused && {backgroundColor:Colors.appColors.primary,borderRadius: 30,
                height:60
            }]}
          >
            <Animated.View style={animatedIconStyle}>
                {icon[routeName]({color:isFocused?Colors.appColors.white:'#222'})}
            </Animated.View>
            <Animated.Text style={[{ color: isFocused ? Colors.appColors.white : '#222',fontSize:12 },animatedTextStyle]}>
              {label}
            </Animated.Text>
          </PlatformPressable>
        );
}

export default function TabBar({ state, descriptors, navigation }:BottomTabBarProps) {
    const [dimensions,setDimensions]=useState({height:20,width:100})
    const buttonWidth=dimensions.width/state.routes.length
    const onTabBarLayout=(e:LayoutChangeEvent)=>{
        setDimensions({
            height:e.nativeEvent.layout.height,
            width:e.nativeEvent.layout.width,
        })
    }
    const tabPositionX=useSharedValue(0)
    const animatedStyle=useAnimatedStyle(()=>{
        return {
            transform:[{translateX:tabPositionX.value}]
        }
    })
    return (
        <View onLayout={onTabBarLayout} style={styles.tabBar}>
            {/* <Animated.View style={[animatedStyle,{
                position:'absolute',backgroundColor:Colors.appColors.primary,borderRadius: 30,
                marginHorizontal:12,height:dimensions.height-20,width:buttonWidth-25}]} 
            /> */}
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label:any =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const isFocused = state.index === index;

                const onPress = (e:any) => {
                    // tabPositionX.value=withSpring(buttonWidth*index,{duration:6000})
                    tabPositionX.value=buttonWidth*index
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }

                };

                const onLongPress = () => {
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                });
                };

                return (
                    <TabBarButton
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name}
                        color={isFocused?Colors.appColors.primary:'#222'}
                        label={label}
                        widthF={buttonWidth-25}
                        heightF={dimensions.height-20}
                        options={options}
                    />
                //   <PlatformPressable
                //     href={buildHref(route.name, route.params)}
                //     accessibilityState={isFocused ? { selected: true } : {}}
                //     accessibilityLabel={options.tabBarAccessibilityLabel}
                //     testID={options.tabBarButtonTestID}
                //     onPress={onPress}
                //     onLongPress={onLongPress}
                //     style={styles.tabBarItem}
                //   >
                //     {icon[route.name]({color:isFocused?Colors.appColors.primary:'#222'})}
                //     <Text style={{ color: isFocused ? Colors.appColors.primary : colors.text }}>
                //       {label}
                //     </Text>
                //   </PlatformPressable>
                );
            })}
        </View>
    );
}

const styles=StyleSheet.create({
    tabBar:{
        position:'absolute',
        bottom:60,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#fff',
        marginHorizontal:80,
        minWidth:'60%',
        padding:15,
        borderRadius:35,
        shadowColor:Colors.appColors.primary,
        shadowOffset:{width:0,height:10},
        shadowRadius:10,
        shadowOpacity:0.5,
        elevation:20
    },
    tabBarItem:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        gap:5
    }
})