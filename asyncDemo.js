function resolveAfter4Seconds() {
  try {
    return new Promise(resolve => {
      setTimeoutZ(() => {
        resolve('resolved');
      }, 4000);
    });    
  } catch (error) {
    console.log('in 4Sec, error: ' + error);
  }
}

async function asyncCall() {
  console.log('In async calling');
  try {
    const result = await resolveAfter4Seconds();
    console.log(result);
    // expected output: "resolved"   
  } catch (error) {
      console.log('In async, error: ' + error);
  }
  finally {
    console.log('In async finally; done');
  }
}

setTimeout(function(){ console.log("Main Hello"); }, 8000);
console.log('main start');
try {
  asyncCall();  
} catch (error) {
  console.log('In main 8, error: ' + error);
}
console.log('main 8 end');
