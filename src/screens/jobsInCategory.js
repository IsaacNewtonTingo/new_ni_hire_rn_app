import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import firestore from '@react-native-firebase/firestore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function JobsInCategories({route, navigation}) {
  const [jobsList, setJobsList] = useState([]);
  const [noData, setNoData] = useState(false);

  const [loading, setLoading] = useState(true);

  const itemId = route.params.itemId.toLowerCase();

  useEffect(() => {
    getJobs();
  }, []);

  async function getJobs() {
    const subscriber = await firestore()
      .collection(`Services`)
      .where('category', '==', itemId)
      .onSnapshot(querySnapshot => {
        const jobs = [];

        if (querySnapshot.size <= 0) {
          setNoData(true);
          setLoading(false);
        } else {
          setNoData(false);
          querySnapshot.forEach(documentSnapshot => {
            jobs.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });
          setLoading(false);
        }
        setJobsList(jobs);
        setLoading(false);
      });
    return subscriber;
  }

  function Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator color="white" size="large" />
        <Text style={{color: 'white', fontWeight: '700', marginTop: 10}}>
          Loading data
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {noData == false ? (
        <FlatList
          data={jobsList}
          renderItem={({item}) => (
            <>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('JobMembers', {
                    jobId: item.jobTitle,
                  })
                }
                style={styles.jobTitleContainer}
                key={item.id}>
                <Text
                  style={{
                    fontWeight: '700',
                    color: 'white',
                  }}>
                  {Capitalize(item.jobTitle)}
                </Text>

                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={15}
                  color="gray"
                />
              </TouchableOpacity>
              <View
                style={{
                  borderWidth: 0.3,
                  borderColor: '#262626',
                  marginVertical: 5,
                }}
              />
            </>
          )}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text
            style={{
              color: 'white',
              fontWeight: '700',
              textAlign: 'center',
            }}>
            No jobs available for the selected category
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
});
