public static boolean findMagicalElement(int[] arrayX, int[] arrayY) {
// Find the most significant element in Array X
int magicalElementX = findMax(arrayX);

    // Check if the magical element from Array X exists in Array Y
    return containsElement(arrayY, magicalElementX);
}

public static int findMax(int[] array) {
    int max = array[0];
    for (int num : array) {
        if (num > max) {
            max = num;
        }
    }
    return max;
}

public static boolean containsElement(int[] array, int target) {
    for (int num : array) {
        if (num == target) {
            return true;
        }
    }
    return false;
}