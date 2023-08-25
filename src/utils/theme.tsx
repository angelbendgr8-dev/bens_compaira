import { extendTheme } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)",
  color: "blue.300",
};
export const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "gray.600",
        lineHeight: "tall",
        bg: "secondary.100",
        // position:'relative',
        height: "100%",
        // bg: "transparent",
        // overflow: 'scroll',
      },
    },
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2.5,
              transformOrigin: "left top",
            },
          },
        },
        multiselect: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
              {
                ...activeLabelStyles,
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2.5,
              transformOrigin: "left top",
            },
          },
        },
      },
    },
    MultiSelect: MultiSelectTheme,

    Drawer: {
      parts: ["dialog", "header", "body"],
      variants: {
        primary: {
          secondary: {
            dialog: {
              maxW: "20px",
            },
          },
        },
      },
    },
  },
  colors: {
    primary: {
      50: "#E6F0FE",
      100: "#31A7E1",
      200: "#2c2e7e",
      300: "#1B76D2",
      // ...
      900: "#1a202c",
    },
    secondary: {
      100: "#F7F8FC",
    },
    muted: {
      100: "#CFCFCF",
      200: "#797979",
    },
    tabActive: {
      100: "#EF8F41",
    },
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
});
