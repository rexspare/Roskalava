import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Fontisto,
} from "@expo/vector-icons";
import ListPicker from "../components/ListPicker";
import api, {
  setLocale,
} from "../api/client";
import settingsStorage from "../app/settings/settingsStorage";
import { getDrawerOptionsData, getRelativeTimeConfig, __ } from "../language/stringPicker";
import moment from "moment";
import { routes } from "../navigation/routes";

import { COLORS } from "../variables/color";
import { useStateValue } from "../StateProvider";
import DrawerOption from "../components/DrawerOption";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { miscConfig } from "../app/services/miscConfig";
import DrawerShareOption from "../components/DrawerShareOption";
import { ScrollView } from "react-native-gesture-handler";
const languages = require("../language/languages.json");
import rtlSupoortedLng from "../language/rtlSupoortedLng.json";


const { width: wWidth } = Dimensions.get("window");

const DrawerScreen = (props) => {
  const [{ appSettings, user, rtl_support }, dispatch] = useStateValue();
  const [drawerOptions, setDrawerOptions] = useState(
    getDrawerOptionsData(appSettings.lng)
  );
  const [langloading, setLangLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [langArr, setLangArr] = useState([]);
  useEffect(() => {
    if (Object.keys(languages).length > 1) {
      let tempLangArr = [];
      Object.keys(languages).map(
        (_key, ind) => (tempLangArr[ind] = { id: _key, name: languages[_key] })
      );
      setLangArr([...tempLangArr]);
      setLangLoading(false);
    }
    setDrawerOptions(getDrawerOptionsData(appSettings.lng));
  }, [appSettings.lng]);
  const [langPicker, setLangPicker] = useState(false);




  const handleLanguageChange = (language) => {
    if (appSettings.lng === language.id) {
      setLangPicker(false);
      return true;
    }
    setLoggingOut(true);
    setLocale(language.id);
    const tempSettings = {
      ...appSettings,
      lng: language.id,
    };

    dispatch({
      type: "SET_SETTINGS",
      appSettings: tempSettings,
    });

    if (!rtl_support) {
      if (
        rtlSupoortedLng.includes(language.id) &&
        !rtlSupoortedLng.includes(deviceLocale)
      ) {
        dispatch({
          type: "SET_RTL_SUPPORT",
          rtl_support: true,
        });
      }
    } else {
      if (!rtlSupoortedLng.includes(language.id)) {
        dispatch({
          type: "SET_RTL_SUPPORT",
          rtl_support: false,
        });
      }
    }

    settingsStorage.storeAppSettings(JSON.stringify(tempSettings));
    const timeConfig = getRelativeTimeConfig(appSettings.lng);
    moment.updateLocale("en-gb", {
      relativeTime: timeConfig,
    });
    setLangPicker(false);
    setTimeout(() => {
      props.navigation.replace(routes.drawerNavigator);
    }, 1000);
  };

  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };
  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };
  return (
    <View style={styles.container}>

      <View
        style={{
          alignItems: "center",
          backgroundColor: COLORS.primary,
          height: wWidth * 0.2,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: "5%",
            top: "50%",
            transform: [{ translateY: -15 }],
            zIndex: 5,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.closeDrawer();
            }}
          >
            <Feather name="x" size={30} color={COLORS.white} />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            height: wWidth * 0.2,
            paddingHorizontal: "20%",
            width: "100%",
          }}
        >
          <Image
            source={require("../assets/logo_header.png")}
            style={{ height: "100%", width: "100%", resizeMode: "contain" }}
          />
        </View>
      </View>

      <View style={{ paddingLeft: 20, paddingRight: 20 }}>
        <View style={styles.contentWrapper}>
          {/* Language Setting */}
          {Object.keys(languages).length > 1 && (
            <View
              style={[
                styles.notiWrapper,
                {
                  flexDirection: rtl_support ? "row-reverse" : "row",
                  alignItems: "center",
                },
              ]}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: rtl_support ? "row-reverse" : "row",
                }}
              >
                <FontAwesome name="language" size={24} color={COLORS.primary} />
                <Text
                  style={[
                    {
                      fontSize: 20,
                      color: COLORS.primary,
                      paddingHorizontal: 5,
                    },
                    rtlText,
                  ]}
                >
                  {__("settingsScreenTexts.languageTitle", appSettings.lng)}
                </Text>
              </View>
              {langloading ? (
                <View style={{ flex: 1 }}>
                  <ActivityIndicator size={"small"} color={COLORS.primary} />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 5,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      paddingHorizontal: 15,
                      paddingVertical: 8,
                      flexDirection: rtl_support ? "row-reverse" : "row",
                      alignItems: "center",
                      backgroundColor: COLORS.white,
                    }}
                    onPress={() => setLangPicker(true)}
                  >
                    <Text style={{ paddingHorizontal: 5 }}>
                      {languages[appSettings.lng]}
                    </Text>
                    <View style={{ paddingHorizontal: 5 }}>
                      <FontAwesome
                        name="caret-down"
                        size={15}
                        color={COLORS.gray}
                      />
                    </View>
                  </TouchableOpacity>
                  <ListPicker
                    pickerVisible={langPicker}
                    data={langArr}
                    onClick={handleLanguageChange}
                    overlayClick={() => setLangPicker(false)}
                    selected={appSettings?.lng || null}
                    pickerLabel={__(
                      "settingsScreenTexts.languageTitle",
                      appSettings.lng
                    )}
                    centeredContent={true}
                  />
                </View>

              )}
            </View>
          )}
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContentWrap}>
          {drawerOptions.map((item, index) => {
            if (item?.id === "share") {
              if (!miscConfig?.enableAppSharing) {
                return null;
              } else {
                return (
                  <DrawerShareOption
                    item={item}
                    key={`${index}`}
                    isLast={drawerOptions.length - 1 == index}
                  />
                );
              }
            }
            return (
              <DrawerOption
                item={item}
                key={`${index}`}
                isLast={drawerOptions.length - 1 == index}
                navigation={props.navigation}
              />
            );
          })}

        </View>
      </DrawerContentScrollView>



      <View style={styles.footerSectionWrap}>
        <View style={styles.footerContentWrap}>
          <Text style={styles.copyrightText}>
            {__("drawerScreenTexts.copyrightText", appSettings.lng)}{" "}
            <Text style={styles.link}>
              {__("drawerScreenTexts.linkText", appSettings.lng)}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeBtnWrap: {
    position: "absolute",
    top: "6%",
    left: "3%",
    zIndex: 1,
  },
  container: { flex: 1 },
  copyrightText: {
    color: COLORS.gray,
  },
  drawerContentWrap: {
    paddingHorizontal: wWidth * 0.03,
    paddingVertical: 10,
  },
  footerSectionWrap: {
    paddingHorizontal: "3%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 15,
    alignItems: "center",
  },
  headerBg: {
    width: "100%",
    resizeMode: "contain",
    // height: wWidth * 0.35,
  },
  headerBgWrap: {
    width: "100%",
    backgroundColor: COLORS.primary,
    height: wWidth * 0.35,
    overflow: "hidden",
    alignItems: "center",
    // justifyContent: "center",
  },
  link: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  sectionBottom: {
    height: 1,
    backgroundColor: COLORS.border_light,
    marginVertical: 10,
  },
  sectionTitleWrap: {
    paddingTop: 20,
  },
});

export default DrawerScreen;
