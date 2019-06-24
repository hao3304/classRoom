import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import VueApollo from "vue-apollo";
import store from "./store";
import Vue from "vue";
import { Notice } from "iview";
import fetch from "unfetch";
import ls from "@/libs/ls";

const iotLink = new HttpLink({
  uri: process.env.VUE_APP_BOOT + `/${process.env.VUE_APP_DISPLAY}/iot`,
  credentials: "include",
  fetch
});


const rheniumLink = new HttpLink({
  uri: process.env.VUE_APP_BOOT + `/${process.env.VUE_APP_DISPLAY}/rhenium`,
  credentials: "include",
  fetch
});

const iotAdminLink = new HttpLink({
  uri: process.env.VUE_APP_BOOT + `/${process.env.VUE_APP_DISPLAY}/iot-admin`,
  credentials: "include",
  fetch
});

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      "X-AUTH-TOKEN": ls.get("token")
    }
  });
  return forward(operation);
});

const error = new onError(
  ({ networkError, graphQLErrors, operation, forward }) => {
    if (graphQLErrors && graphQLErrors.length > 0) {
      if (graphQLErrors[0].message.indexOf("401") > -1) {
        return store.commit("logout");
      }
      return Notice.error({
        title: "警告",
        desc: graphQLErrors[0].message
      });
    }

    if (networkError) {
      if (networkError.result.code && networkError.result.code == "403") {
        store.commit("logout");
      } else {
        Notice.error({
          title: networkError.message,
          desc: networkError.result.errors[0].message
        });
      }
    }
    return forward(operation);
  }
);
export const iotClient = new ApolloClient({
  link: error.concat(middlewareLink.concat(iotLink)),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only"
    }
  },
  connectToDevTools: true
});


export const rheniumClient = new ApolloClient({
  link: error.concat(middlewareLink.concat(rheniumLink)),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only"
    }
  },
  connectToDevTools: true
});

export const iotAdminClient = new ApolloClient({
  link: error.concat(middlewareLink.concat(iotAdminLink)),
  cache: new InMemoryCache({
    addTypename: false
  }),
  defaultOptions: {
    query: {
      fetchPolicy: "network-only"
    }
  },
  connectToDevTools: true
});

Vue.use(VueApollo);
export default new VueApollo({
  defaultClient: iotClient,
  clients: {
    rhenium: rheniumClient,
    ["iot-admin"]: iotAdminClient,
    iot: iotClient
  }
});
