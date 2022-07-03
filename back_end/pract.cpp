#include <iostream>
#include <cstdlib>
#include <string>

using namespace std;

main(int c, char* argv[]){

    cout<<"calling:"<<argv[1]<<endl;
    string cmd = "node pract.js "+(string)argv[1];
    cout<<system(cmd.c_str())<<endl; 
    cout<<cmd<<endl;

}