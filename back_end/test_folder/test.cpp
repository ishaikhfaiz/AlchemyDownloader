#include <iostream>
#include <fstream>
#include <string>
#include <windows.h>

using namespace std;

main(int c, char* par[]) {
    Sleep(1000);
    fstream f;
    string name = std::string(par[1])+"asfm_cpp.txt";
    f.open(name,ios::out);
    f<<par[1];
}